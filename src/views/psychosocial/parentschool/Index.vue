<script lang="ts" setup>
import BaseCrud from "../../../components/base/BaseCrud.vue"
import type { Header, Item } from "vue3-easy-data-table";
import axios from "axios";
import services from '@/services/parentschool.service'
import permissions from "@/permissions";

const parentschools_services = services()

const router = useRouter()
const route = useRoute()

const routeName = computed(() => {
    return String(route.name).split('.')[0]
})

const create = () => {
    router.push({ name: `${routeName.value}.create` })
}

async function destroy(id: string | number) {
    await parentschools_services.destroy(id);
    fetchData();
}

const headers: Header[] = [
    { text: "ID", value: 'id' },
    { text: "CONSECUTIVO", value: 'consecutive' },
    { text: "MONITOR", value: 'monitor_id' },
    { text: "HORA INICIO", value: 'start_time' },
    { text: "HORA FINAL", value: 'final_time' },
    { text: "LUGAR DE ATENCIÓN", value: 'place_attention' },
    { text: "CONTACTO", value: 'contact' },
    // { text: "OBJETIVO", value: 'objective' },
    // { text: "DESARROLLO", value: 'development' },
    // { text: "CONCLUSIONES", value: 'conclusions' },
    { text: "CREACIÓN", value: 'created_at' },
    { text: "ESTADO", value: 'status' },
    { text: "ACCIONES", value: "actions" },
];

const items = ref<Item[]>([]);

async function fetchData() {
    await parentschools_services.get().then(() => {
        console.log(parentschools_services.data.all)
        items.value = parentschools_services.data.all
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
                    "FECHA": item.date,
                    "MONITOR CULTURAL": item.monitor_id,
                    "HORA INICIO": item.start_time,
                    "HORA FINAL": item.final_time,
                    "LUGAR DE ATENCIÓN": item.place_attention,
                    "CONTACTO": item.contact,
                    "OBJETIVO": item.objective,
                    "DESARROLLO": item.development,
                    "CONCLUSIONES": item.conclusions,
                }
            },
            multimedia: {
                title: 'Multimedia',
                fields: {
                    "DESARROLLO DE LA ACTIVIDAD ARCHIVO": item.development_activity_image,
                    "EVIDENCIA DE PARTICIPACIÓN ARCHIVO": item.evidence_participation_image,
                }
            },
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
        <h2 class="text-lg font-medium mr-auto">Escuela de Padres</h2>
        <div v-if="permissions.parentschools.create()" class="w-full sm:w-auto flex mt-4 sm:mt-0">
            <button class="btn btn-primary shadow-md mr-2" @click="create">Crear escuela de padres</button>
        </div>
    </div>
    <div class="intro-y box p-5 mt-5">
        <BaseCrud :headers="headers" :items="items" label="la escuela de padre"
            :management_permissions="permissions.parentschools.crud_management()" :item_see_fnc="item_map"
            :on-delete-fnc="destroy" />
    </div>
</template>