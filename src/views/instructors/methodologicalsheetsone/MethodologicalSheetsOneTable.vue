<script setup>
import services from "@/services/methodologicalSheetsOne.service"
import BaseCrud from "../../../components/base/BaseCrud.vue"
import { useRouter } from 'vue-router'
import permissions from "@/permissions"
import mixins from "@/mixins"
import * as moment from "moment"
import 'moment/locale/es'
const msoService = services()

const router = useRouter();
const route = useRoute();

const routeName = computed(() => {
    return String(route.name).split(".")[0];
});

const createInscription = () => {
    router.push({ name: `${routeName.value}.create` });
};

const editInscription = (id) => {
    router.push({ name: `${routeName.value}.edit`, params: { id: id } });
};

async function onDeleteMso(id) {
    msoService.destroy(id)
    await fetchData()
}

const headers = [
    { text: "#", value: "id" },
    { text: "CONSECUTIVO", value: "consecutive" },
    { text: "NOMBRE DE SEMILLERO", value: "semillero_name" },
    { text: "DOCUMENTO DE ACUDIENTE", value: "cultural_right_id" },
    { text: "ORIENTACIÓN", value: "orientation_id" },
    { text: "LINIEAMIENTO", value: "lineament_id" },
    { text: "ACCIONES", value: "actions" },
];

const items = ref([]);

const item_map = (item) => {
    const { id, consecutive, semillero_name, lineament_id, cultural_right_id, value, orientation_id, filter_level, characteristics_process, comments, created_at, objective_process, status, worked_expertise
    } = item
    return {
        id,
        consecutive,
        sections: {
            semillero_name: {
                title: "Ficha Metodológica de Planeación",
                fields: {
                    "NOMBRE DEL SEMILLERO CULTURAL": semillero_name,
                    "FILTRO": filter_level,
                    "DERECHO CULTURAL": mixins.get_option_label('cultural_rights', cultural_right_id),
                    "LINEAMIENTOS": mixins.get_option_label('lineaments', lineament_id),
                    "ORIENTACIONES": mixins.get_option_label('orientations', orientation_id),
                    "VALOR": mixins.get_option_label('values', value),
                    "EXPERTICIA ARTÍSTICA A TRABAJAR": worked_expertise,
                    "CARACTERÍSTICAS DEL PROCESO A TRABAJAR": characteristics_process,
                    "OBJETIVO DEL PROCESO": objective_process,
                    "OBSERVACIONES": comments,
                    "CREADO": moment(created_at).locale('es').format('LL')
                }
            }

        }
    }
}

async function fetchData() {
    await msoService.get().then((response) => {
        items.value = response.data;
    })
}

onMounted(async () => {
    await fetchData();
    items.value.map((item) => {
        return {
            ...item,
            actions: "Acciones",
        };
    });
});
</script>

<template>
    <div class="intro-y flex flex-col sm:flex-row items-center mt-8">
        <h2 class="text-lg font-medium mr-auto">Ficha Metodológica de Planeación</h2>
        <div v-if="permissions.inscriptions.create()" class="w-full sm:w-auto flex mt-4 sm:mt-0">
            <button class="btn btn-primary shadow-md mr-2" @click="createInscription">
                Crear ficha metodológica
            </button>
        </div>
    </div>
    <div class="intro-y box p-5 mt-5">
        <BaseCrud :onDeleteFnc="onDeleteMso" :headers="headers" :items="items" :item_see_fnc="item_map" label="la inscripción"
            :management_permissions="permissions.inscriptions.crud_management()" />
    </div>
</template>