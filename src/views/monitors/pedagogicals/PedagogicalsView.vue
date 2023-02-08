<script lang="ts" setup>
import axios from "axios";
import BaseCrud from "@/components/base/BaseCrud.vue"
import permissions from "@/permissions";
import services from '@/services/pedagogical.service'
import type { Header, Item } from "vue3-easy-data-table";
import mixins from "@/mixins";

const pedagogicals_services = services()

const router = useRouter()
const route = useRoute()

const routeName = computed(() => {
    return String(route.name).split('.')[0]
})

const create = () => {
    router.push({ name: `${routeName.value}.create` })
}

async function destroy(id: string | number) {
    await pedagogicals_services.destroy(id);
    fetchData();
}

const headers: Header[] = [
    { text: "CONSECUTIVO", value: "consecutive" },
    { text: "ACTIVIDAD", value: "activity_name" },
    { text: "FECHA", value: "activity_date", width: 120 },
    { text: "EXPERTICIA", value: "expertise.name" },
    { text: "NAC", value: "nac.name" },
    { text: "DERECHO CULTURAL", value: "cultural_right.name" },
    { text: "LINEAMIENTO", value: "lineament_id" },
    { text: "ORIENTACIÓN", value: "orientation_id" },
    { text: "CREACIÓN", value: "created_at" },
    { text: "CREADO POR", value: "user.name" },
    { text: "ESTADO", value: "status" },
    { text: "ACCIONES", value: "actions" },
];

const items = ref<Item[]>([]);

async function fetchData() {
    await pedagogicals_services.get().then(() => {
        items.value = pedagogicals_services.data.all
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
                    "ACTIVIDAD": item.activity_name,
                    "FECHA": item.activity_date,
                    "EXPERTICIA": item.expertise.name,
                    "NAC": item.nac.name,
                    // "ESTADO": item.status,
                    // "MENSAJE DE RECHAZO": item.reject_message,
                }
            },
            methodological_component: {
                title: 'Componente metodológico',
                fields: {
                    "DERECHO CULTURAL": item.cultural_right.name,
                    "LINEAMIENTO": mixins.get_option_label('lineaments', item.lineament_id),
                    "ORIENTACIÓN": mixins.get_option_label('orientations', item.orientation_id),
                    "OBJETIVO VIVENCIAL": item.experiential_objective,
                }
            },
            macrostructure_cultural: {
                title: 'Etapas y Desarrollo de la Macroestructura Cultural',
                fields: {
                    "MANIFESTACIÓN CULTURAL": item.manifestation,
                    "PROCESO": item.process,
                    "PRODUCTO": item.product,
                    "RECURSOS NECESARIOS": item.resources,
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
    <div class="intro-y flex flex-col sm:flex-row items-center mt-5">
        <h2 class="text-lg font-medium mr-auto">Ficha Pedagógica</h2>
        <div v-if="permissions.pedagogicals.create()" class="w-full sm:w-auto flex mt-4 sm:mt-0">
            <button class="btn btn-primary shadow-md mr-2" @click="create">Crear ficha pedagógica</button>
        </div>
    </div>
    <div class="intro-y box mt-5 p-5">
        <BaseCrud :headers="headers" :items="items" :item_see_fnc="item_map" :management_permissions="permissions.pedagogicals.crud_management()" label="la ficha pedagógica" :on-delete-fnc="destroy" />
    </div>
</template>