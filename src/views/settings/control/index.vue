<script lang="ts" setup>
import BaseCrud from "../../../components/base/BaseCrud.vue";
import type { Header, Item } from "vue3-easy-data-table";
import services from "../../../services/generals.service";
import { useRouter } from 'vue-router';
const router = useRouter();
const route = useRoute();

const service = services()

const routeName = computed(() => {
    return String(route.name).split(".")[0];
});

const item_map = (item: { [key: string]: any }) => {
    const { id, consecutive } = item
    return {
        id,
        consecutive,
        sections: {
            original: {
                title: 'Información original',
                fields: {
                    'Data original': item.data_original,
                    // "MENSAJE DE RECHAZO": item.reject_message,
                }
            },
            change: {
                title: 'Información actualizada',
                fields: {
                    'Data change': item.data_change,
                    // "MENSAJE DE RECHAZO": item.reject_message,
                }
            },
        }
    }
}

async function deleteModule(id: string | number) {
    await service.destroy(id);
    fetchData();
}

const headers: Header[] = [
    { text: "#", value: "id" },
    { text:"USUARIO",value:"user.name"},
    { text:"MODELO",value:"data_model_type"},
    { text:"ID",value:"data_model_id"},
    // { text:"ACTUAL",value:"data_original"},
    // { text:"MODIFICADOS",value:"data_change"},
    { text: "ACCIONES", value: "actions" },
];

const items = ref([]);

async function fetchData() {
    await service.getChangeDataModels().then(() => {
        items.value = service.data.value
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

    <div class="intro-y box p-5 mt-5">
        <BaseCrud @change_status="async () => await fetchData()" :headers="headers" :items="items" label="Usuarios"
            :on-delete-fnc="deleteModule" :server_options="{ page: 1, rowsPerPage: 15 }" :item_see_fnc="item_map" />
    </div>
</template>