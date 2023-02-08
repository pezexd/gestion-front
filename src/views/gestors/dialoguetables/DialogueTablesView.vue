<script lang="ts" setup>
import BaseCrud from "../../../components/base/BaseCrud.vue"
import type { Header, Item } from "vue3-easy-data-table";
import axios from "axios";
import services from '../../../services/dialoguetables.service'
import permissions from "@/permissions";
import mixins from "@/mixins";

const dialoguetables_services = services()

const router = useRouter()
const route = useRoute()

const routeName = computed(() => {
    return String(route.name).split('.')[0]
})

const create = () => {
    router.push({ name: `${routeName.value}.create` })
}

async function destroy(id: string | number) {
    await dialoguetables_services.destroy(id);
    fetchData();
}

const headers: Header[] = [
    { text: "CONSECUTIVO", value: "consecutive" },
    { text: "FECHA", value: "activity_date", width: 120 },
    { text: "HORA INICIO", value: "start_time" },
    { text: "HORA FINAL", value: "final_hour" },
    { text: "NAC", value: "nac.name" },
    { text: "CREACIÓN", value: "created_at" },
    { text: "ESTADO", value: "status" },
    { text: "ACCIONES", value: "actions" },
];

const items = ref<Item[]>([]);

async function fetchData() {
    await dialoguetables_services.get().then(() => {
        items.value = dialoguetables_services.data.all
        console.log(items.value)
    })
}

const item_map = (item: { [key: string]: any }) => {
    const { id, consecutive } = item
    return {
        id,
        consecutive,
        sections: {
            general: {
                title: 'Datos Generales',
                fields: {
                    "FECHA": item.activity_date,
                    "HORA INICIO": item.start_time,
                    "HORA FINAL": item.final_hour,
                    "NAC": item.nac.name,
                }
            },
            description_workday: {
                title: 'Descripción de la Jornada',
                fields: {
                    "DESCRIPCIÓN": item.workday_description,
                    "OBJETIVO": item.target_workday,
                    "TEMA ABORDADO": item.theme,
                    "AGENDA DEL DIA": item.schedule_day,
                    "LOGROS Y DIFICULTADES": item.achievements_difficulties,
                    "ALERTAS": item.alerts,
                }
            },
            multimedia: {
                title: 'Multimedia',
                fields: {
                    "DESARROLLO DEL DIÁLOGO CULTURAL (IMAGEN)": item.place_image1,
                    "EVIDENCIA DE PARTICIPACIÓN (IMAGEN)": item.place_image2,
                }
            },
            assistants: {
                title: 'Asistentes Agregados',
                fields: {
                    "ASISTENTES": item.assistants.map((assistant) => ({
                        "NOMBRE": assistant.assistant_name,
                        "CÉDULA": assistant.assistant_document_number,
                        "CARGO": assistant.assistant_position,
                        "NAC": mixins.get_option_label('nacs', assistant.nac_id),
                        "TELÉFONO": assistant.assistant_phone,
                        "EMAIL": assistant.assistant_email,
                    })),
                }
            }
        }
    }
}

onMounted(async () => {
    await fetchData()
    items.value.map((item) => {
        return {
            ...item,
            actions: 'Acciones'
        }
    })
})
</script>

<template>
    <div class="intro-y flex flex-col sm:flex-row items-center mt-8">
        <h2 class="text-lg font-medium mr-auto">Mesa de Diálogo</h2>
        <div v-if="permissions.dialoguetables.create()" class="w-full sm:w-auto flex mt-4 sm:mt-0">
            <button class="btn btn-primary shadow-md mr-2" @click="create">Crear Mesa de Diálogo</button>
        </div>
    </div>
    <div class="intro-y box p-5 mt-5">
        <BaseCrud :headers="headers" :items="items" :item_see_fnc="item_map" :management_permissions="permissions.dialoguetables.crud_management()" label="la mesa de dialogo" :on-delete-fnc="destroy" />
    </div>
</template>