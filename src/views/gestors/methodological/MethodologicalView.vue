<script lang="ts" setup>
import BaseCrud from "../../../components/base/BaseCrud.vue"
import type { Header, Item } from "vue3-easy-data-table";
import axios from "axios";
import services from '../../../services/methodological.service'
import permissions from "@/permissions";
import mixins from "@/mixins";

const router = useRouter()
const route = useRoute()

const methodological_services = services()

const routeName = computed(() => {
    return String(route.name).split('.')[0]
})

const create = () => {
    router.push({ name: `${routeName.value}.create` })
}

const update = (id: string | number) => {
    router.push({ name: `${routeName.value}.edit`, params: { id: id } })
}

async function destroy(id: string | number) {
    await methodological_services.destroy(id);
    fetchData();
}

const headers: Header[] = [
    { text: "CONSECUTIVO", value: "consecutive" },
    { text: "LUGAR", value: "place" },
    { text: "FECHA", value: "activity_date", },
    { text: "HORA INICIO", value: "start_time", },
    { text: "HORA FINAL", value: "final_hour", },
    { text: "EXPERTICIA", value: "expertise_id" },
    { text: "NAC", value: "nac_id", },
    { text: "CREACIÓN", value: "created_at", },
    { text: "ESTADO", value: "status", },
    { text: "ACCIONES", value: "actions" },
];

const items = ref<Item[]>([]);

async function fetchData() {
    await methodological_services.get().then(() => {
        items.value = methodological_services.data.all

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
                    "LUGAR": item.place,
                    "FECHA": item.activity_date,
                    "HORA INICIO": item.start_time,
                    "HORA FINAL": item.final_hour,
                    "EXPERTICIA": mixins.get_option_label('expertises', item.expertise_id),
                    "NAC": mixins.get_option_label('nacs', item.nac_id),
                }
            },
            description_workday: {
                title: 'Descripción de la Jornada',
                fields: {
                    "SE CUMPLIÓ EL OBJETIVO": (item.goals_met == 1) ? 'SI' : 'NO',
                    "EXPLICACIÓN": item.explanation,
                    "PEDAGÓGICO": item.pedagogical_comments,
                    "TÉCNICO PRACTICO": item.technical_practical_comments,
                    "METODOLOGICO": item.methodological_comments,
                    "OTROS Y OBSERVACIONES": item.others_observations,
                }
            },
            multimedia: {
                title: 'Multimedia',
                fields: {
                    "DESARROLLO DEL DESARROLLO (IMAGEN)": item.place_file1,
                    "EVIDENCIA DE LAS PERSONAS (IMAGEN)": item.place_file2,
                }
            },
            assistants: {
                title: 'Asistentes Agregados',
                fields: {
                    "ASISTENTES": item.assistants.map((assistant) => {
                        const record = mixins.get_monitor_by_id(assistant.id)
                        if (record != 'No encontrad@'){
                            return {
                                "NOMBRE": record.monitor_fullname,
                                "CÉDULA": record.document_number,
                            }
                        }
                        else {
                            return {
                                "NOMBRE": assistant.name,
                                "CÉDULA": 'No encontrada',
                            }
                        }
                    }),
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
        <h2 class="text-lg font-medium mr-auto">Instrucción Metodológica</h2>
        <div v-if="permissions.methodologicalInstructions.create()" class="w-full sm:w-auto flex mt-4 sm:mt-0">
            <button class="btn btn-primary shadow-md mr-2" @click="create">Crear Instrucción Metodológica</button>
        </div>
    </div>
    <div class="intro-y box p-5 mt-5">
        <BaseCrud :headers="headers" :items="items" :management_permissions="permissions.methodologicalInstructions.crud_management()" :item_see_fnc="item_map" label="la mesa de dialogo" :on-delete-fnc="destroy" />
    </div>
</template>