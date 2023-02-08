<script lang="ts" setup>
import BaseCrud from "@/components/base/BaseCrud.vue"
import type { Header, Item } from "vue3-easy-data-table"
import axios from "axios"
import services from '@/services/psychosocialinstruction.service'
import permissions from "@/permissions";
import mixins from "@/mixins";

const psychosocialInstructionService = services()

const router = useRouter()
const route = useRoute()

const routeName = computed(() => {
    return String(route.name).split('.')[0]
})

const create = () => {
    router.push({ name: `${routeName.value}.create` })
}

async function destroy(id: string | number) {
    await psychosocialInstructionService.destroy(id)
    fetchData()
}
const headers: Header[] = [
    { text: "CONSECUTIVO", value: "consecutive" },
    { text: "FECHA", value: "activity_date", width: 120 },
    { text: "NAC", value: "nac.name" },
    { text: "HORA INICIO", value: "start_time" },
    { text: "HORA FINAL", value: "final_hour" },
    // { text: "DESARROLLO", value: "development_activity_image" },
    // { text: "PARTICIPACIÓN", value: "evidence_participation_image" },
    { text: "CREACIÓN", value: "created_at" },
    { text: "ESTADO", value: "status" },
    { text: "ACCIONES", value: "actions" },
]
const item_map = (item: { [key: string]: any }) => {
    //copio el objeto para que no se modifique el original
    const { id, consecutive } = item
    const monitors=item.monitors.map(mon=>{
        return {
            "ID":mon.id,
            "NOMBRE COMPLETO":mon.name,
            "CI":mon.email
        }
    })
    const assistants = item.assistants.map(asis=>{
        return {
            NOMBRE:asis.assistant_name,
            CEDULA:asis.assistant_document_number,
            EMAIL:asis.assistant_email,
            TELEFONO:asis.assistant_phone,
            CARGO:asis.assistant_position,
        }
    })
    return {
        id,
        consecutive,
        sections: {
            general: {
                title: 'Datos Generales',
                fields: {
                    "FECHA": item.activity_date,
                    "NAC": mixins.get_option_label('nacs', item.nac_id),
                    "HORA INICIO": item.start_time,
                    "HORA FINAL": item.final_hour,
                    "TEMAS A TRATAR": item.themes_day,
                    "OBJETIVO": item.objective_day,
                    "IMAGEN DE LA ACTIVIDAD": item.development_activity_image,
                    "IMAGEN DEL DESARROLLO": item.evidence_participation_image,
                    //"TABLA DE ASISTENTES":assistants,
                    "MONITORES":monitors,
                    // "ESTADO": item.status,
                    // "MENSAJE DE RECHAZO": item.reject_message,
                },
            },
            asistances:{
                title:"Datos de asistencia",
                fields:{
                    "ASISTENTES": assistants,
                    //"MONITORES ASISTENTES":monitors,
                }
            }   
        }
    }
}


const items = ref<Item[]>([])

async function fetchData() {
    await psychosocialInstructionService.get().then(() => {
        items.value = psychosocialInstructionService.data.all
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
        <h2 class="text-lg font-medium mr-auto">Instrucción Psicosocial</h2>
        <div v-if="permissions.psychosocialinstructions.create()" class="w-full sm:w-auto flex mt-4 sm:mt-0">
            <button class="btn btn-primary shadow-md mr-2" @click="create">Crear una instrucción psicosocial</button>
        </div>
    </div>
    <div class="intro-y box mt-5 p-5">
        <BaseCrud :headers="headers" :items="items" label="la Instrucción Psicosocial" :item_see_fnc="item_map" :management_permissions="permissions.psychosocialinstructions.crud_management()" :on-delete-fnc="destroy" />
    </div>
</template>
