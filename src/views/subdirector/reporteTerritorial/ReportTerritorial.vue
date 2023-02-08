<script lang="ts" setup>
import axios from "axios";
import BaseCrud from "@/components/base/BaseCrud.vue"
import mixins from "@/mixins";
import permissions from "@/permissions";
import binnacleTerritoriesService from '@/services/binnacle_territories.service'
import type { Header, Item } from "vue3-easy-data-table";

const services = binnacleTerritoriesService()

const router = useRouter()
const route = useRoute()

const routeName = computed(() => {
    return String(route.name).split('.')[0]
})

const create = () => {
    router.push({ name: `${routeName.value}.create` })
}

async function destroy(id: string | number) {
    await services.destroy(id);
    fetchData();
}

const headers: Header[] = [
    { text: "CONSECUTIVO", value: "consecutive" },
    { text: "CREADO POR", value: "created_by.name" },
    { text: "FECHA", value: "activity_date", width: 120 },
    { text: "HORA INICIO", value: "start_time" },
    { text: "HORA FINAL", value: "final_hour" },
    { text: "NAC", value: "nac.name" },
    { text: "CREACIÓN", value: "created_at" },
    { text: "USUARIO", value: "user_id" },
    { text: "ROL", value: "roles" },
    { text: "ESTADO", value: "status" },
    { text: "ACCIONES", value: "actions" },
];

const items = ref<Item[]>([]);

const item_map = (item: { [key: string]: any }) => {
    const { id, consecutive, roles } = item
    const rol = computed(() => {
        return roles[0].name
    })
    return {
        id,
        consecutive,
        sections: {
            general: {
                title: 'Datos Generales',
                fields: {
                    "NAC": item.nac.name,
                    "ROL": rol.value,
                    "USUARIO": mixins.get_option_label('users_table', item.user.id),
                    "FECHA": item.activity_date,
                    "HORA INICIO": item.start_time,
                    "HORA FINAL": item.final_hour,
                    "LUGAR": item.place,
                    // "ESTADO": item.status,
                    // "MENSAJE DE RECHAZO": item.reject_message,
                }
            },
            development: {
                title: 'DESARROLLO DE LA VISITA',
                fields: {
                    "OBJETIVOS ESTRATÉGICOS DEL ÁREA": item.strategic_objectives_area,
                    "PROPÓSITO DE LA VISITA": item.purpose_visit,
                }
            },
            diagnostic: {
                title: 'DIAGNÓSTICO INICIAL',
                fields: {
                    "TEMÁTICAS ABORDADAS": item.topics_covered,
                    "PERCEPCIÓN DE LOS PARTICIPANTES FRENTE A LAS ACTIVIDADES DESARROLLADAS POR EL ÁREA": item.participants_perception,
                    "DIFICULTADES O PROBLEMÁTICAS IDENTIFICADAS": item.problems_identified,
                    "RECOMENDACIONES Y ACCIONES DE MEJORA PROPUESTAS POR LOS PARTICIPANTES ": item.recommendations_actions,
                    "PERCEPCIONES/COMENTARIOS/ANÁLISIS FRENTE AL AVANCE DEL PROCESO": item.comments_analysis,
                }
            },
            multimedia: {
                title: 'Multimedia',
                fields: {
                    "IMAGEN DESARROLLO": item.development_activity_image,
                    "IMAGEN EVIDENCIA DE PARTICIPACIÓN": item.evidence_participation_image,
                }
            },
        }
    }
}

async function fetchData() {
    await services.get().then(() => {
        items.value = services.data.all
        console.log('data',services.data.all)
    })
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
        <h2 class="text-lg font-medium mr-auto">Bitácora de visita a territorio</h2>
    </div>
    <div class="intro-y box mt-5 p-5">
        <BaseCrud :headers="headers" :items="items" :item_see_fnc="item_map"
            :management_permissions="permissions.subdireccion.crud_management()" label="la bitácora" :on-delete-fnc="destroy" />
    </div>
</template>