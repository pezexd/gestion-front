<script lang="ts" setup>
import BaseCrud from "../../../components/base/BaseCrud.vue"
import type { Header, Item } from "vue3-easy-data-table";
import axios from "axios";
import managermonitoring from "../../../services/managermonitoring.service";
import permissions from "@/permissions";
import mixins from "@/mixins";

const router = useRouter()
const route = useRoute()
const managermonitoring_service = managermonitoring();

const routeName = computed(() => {
    return String(route.name).split('.')[0]
})

const createManagerMonitoring = () => {
    router.push({ name: `${routeName.value}.create` })
}

const edit = (id: string | number) => {
    router.push({ name: `${routeName.value}.edit`, params: { id: id } })
}

async function deleteManagerMonitoring(id: string | number) {
    await managermonitoring_service.destroy(id).then(() => {
        fetchData()
    })
}

const headers: Header[] = [
    { text: "CONSECUTIVO", value: "consecutive" },
    { text: "MONITOR CULTURAL", value: "user.name" },
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
    await managermonitoring_service.get().then((response) => {
        items.value = managermonitoring_service.data.all

    })
}

const item_map = (item: { [key: string]: any }) => {
    const { id, consecutive } = item
    const find_monitor = (value: string, second_value: string) => {
        const record = mixins.get_monitor_by_id(value)

        return (record != 'No encontrad@') ? record.monitor_fullname : second_value
    }
    return {
        id,
        consecutive,
        sections: {
            general: {
                title: 'Datos Generales',
                fields: {
                    "MONITOR": find_monitor(item.monitor_id, 'No encontrad@'),
                    "FECHA": item.activity_date,
                    "HORA INICIO": item.start_time,
                    "HORA FINAL": item.final_hour,
                    "OBJETIVO DEL SEGUIMIENTO": item.target_tracking,
                    "NAC": item.nac.name,
                }
            },
            testing: {
                title: 'Evaluación y Retroalimentación Metodológica',
                fields: {
                    "LA FICHA PEDAGÓGICA DA CUENTA DEL PROCESO CULTURAL (RANGO)": { max: 5, value: item.cultural_process },
                    "LA FICHA PEDAGÓGICA REFLEJA LOS DERECHOS CULTURALES Y LINEAMIENTOS (RANGO)": { max: 5, value: item.cultural_guidelines },
                    "EL MONITOR CULTURAL MANEJA UNA COMUNICACIÓN ACORDE A LAS PARTICULARIDADES DE LOS BENEFICIARIOS (RANGO)": { max: 5, value: item.cultural_communication },
                    "DIFICULTAD EVIDENCIADA": item.difficulty_cultural_process,
                    "PROPUESTA PARA EL MEJORAMIENTO": item.proposal_improvement,
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
            actions: 'Acciones',
        }
    })
})
</script>

<template>
    <div class="intro-y flex flex-col sm:flex-row items-center mt-8">
        <h2 class="text-lg font-medium mr-auto">Seguimiento de Gestión Cultural</h2>
        <div v-if="permissions.managermonitorings.create()" class="w-full sm:w-auto flex mt-4 sm:mt-0">
            <button class="btn btn-primary shadow-md mr-2" @click="createManagerMonitoring">Crear Seguimiento</button>
        </div>
    </div>
    <div class="intro-y box p-5 mt-5">
        <BaseCrud :headers="headers" :items="items" :item_see_fnc="item_map" :management_permissions="permissions.managermonitorings.crud_management()" label="El seguimiento" :on-delete-fnc="deleteManagerMonitoring" />
    </div>
</template>
