<script lang="ts" setup>
import { useSelectStore } from '@/stores/selects'
import { useVuelidate } from '@vuelidate/core';
import BaseInput from '@/components/base/Input.vue'
import BaseSelect from '@/components/base/Select.vue'
import dayjs from "dayjs";
import services from '@/services/report.services'
import type { Header, Item } from "vue3-easy-data-table";

const { options } = useSelectStore();
const router = useRouter()
const route = useRoute()
const routeName = computed(() => {
    return String(route.name).split('.')[0]
})

// const { form } = storeToRefs(export_store)
const form = reactive({
    nac_id: null,
    date_start: null,
    date_end: null,
    status: null,
    type: null,
    user_id: null,
    rol_id: null,
    data: false,
})

const filters_rules = computed(() => ({
    nac_id: {},
    date_start: {},
    date_end: {},
    status: {},
    type: {},
    user_id: {},
    rol_id: {},
    data: {},
}))

const services_report = services();
const exportExcel = async (type) => {
    await services_report.exportExcel(type, form)
}

const exportPdf = async (type) => {
    await services_report.exportPdf(type, form)
}

const views = (nameroute) => {
    router.push({ name: `${routeName.value}.${nameroute}.index` })
}
const v$ = useVuelidate(filters_rules, form, { $autoDirty: true })

const cleanFilter = () => {
    form.nac_id = null;
    form.date_start = null;
    form.date_end = null;
    form.status = null;
    form.type = null;
    form.user_id = null;
    form.rol_id = null;
    form.data = false;
    services_report.count.value = 0;
    v$.value.$reset();
}

const searchInfoReport = async () => {
    form.data = true;
    return await services_report.searchInfoReport(form)
}

const headers: Header[] = [
    { text: "#", value: "id" },
    { text: "NOMBRE", value: "name" },
    { text: "ACCIONES", value: "actions" },
];

const items = [
    {
        'id': 1,
        'name': 'Informe de pecs',
        'type': 'pecs',
        "pdf": false,
        "excel": true
    },
    {
        'id': 2,
        'name': 'Informe de encuentas',
        'type': 'polls',
        "pdf": false,
        "excel": true
    },
    {
        'id': 3,
        'name': 'Informe de encuestas de deserción',
        'type': 'pollDesertions',
        "pdf": false,
        "excel": true
    },
    {
        'id': 4,
        'name': 'Informe de ficha pedagógicas',
        'type': 'pedagogicals',
        "pdf": false,
        "excel": true
    },
    {
        'id': 5,
        'name': 'Informe de usuarios',
        'type': 'users',
        "pdf": false,
        "excel": true
    },
    {
        'id': 6,
        'name': 'Informe Variables',
        'type': 'variables',
        "pdf": false,
        "excel": true
    },
    {
        'id': 7,
        'name': 'Informe de Sesion',
        'type': 'sesion',
        "pdf": false,
        "excel": true
    },
    {
        'id': 8,
        'name': 'Informe Escuela de padres',
        'type': 'parentschools',
        "pdf": true,
        "excel": true
    },
    {
        'id': 9,
        'name': 'Informe Bitacora Psicopedagogica',
        'type': 'psychopedagogicallogs',
        "pdf": true,
        "excel": false

    },
    {
        'id': 10,
        'name': 'Informe de Acudientes',
        'type': 'attendats',
        "pdf": false,
        "excel": true
    },
    {
        'id': 11,
        'name': 'Informe de Beneficiarios',
        'type': 'beneficiaries',
        "pdf": false,
        "excel": true
    },
    {
        'id': 11,
        'name': 'Mesa de dialogo',
        'type': 'dialogueTables',
        "pdf": false,
        "excel": true
    }

];

const itemSelects = [
    {
        'label': 'Pecs',
        'value': 'pecs',
    },
    {
        'label': 'Encuestas',
        'value': 'polls',
    },
    {
        'label': 'Encuestas de deserción',
        'value': 'pollDesertions',
    },
    {
        'label': 'Ficha pedagógicas',
        'value': 'pedagogicals',
    },
    {
        'label': 'Usuarios',
        'value': 'users',
    },
    {
        'label': 'Variables',
        'value': 'variables',
    },
    {
        'label': 'Sesión',
        'value': 'view',
    },
    {
        'label': 'Escuela de Padres',
        'value': 'parentschools',
    },
    {
        'label': 'Bitácora Psicopedagógica',
        'value': 'psychopedagogicallogs',
    },
    {
        'label': 'Acudientes',
        'value': 'attendats',
    },
    {
        'label': 'Beneficiarios',
        'value': 'beneficiaries',
    },
    {
        'label': 'Mesa de dialogo',
        'value': 'dialogueTables',
    },
];

const maxDate = computed(() => dayjs().format('YYYY-MM-DD'))

</script>
<template>
    <div class="intro-y flex flex-col sm:flex-row items-center mt-8">
        <h2 class="text-lg font-medium mr-auto">LISTADO DE REPORTES</h2>
    </div>
    <div class="intro-y box p-5 mt-5">
        <section class="flex flex-col lg:grid lg:grid-cols-6 xl:grid xl:grid-cols-6 gap-6 justify-evenly mb-8">
            <div class="flex flex-col justify-start h-ful lg:col-span-2 xl:col-span-2">
                <label for="regular-form-2" class="form-label font-bold min-w-max mr-4">FECHA RANGO</label>
                <div class="grid grid-cols-2 gap-6 w-full intro-x">
                    <BaseInput class="" type="date" tooltip="Desde" name="date_start" :max="maxDate" v-model="form.date_start"
                        :validator="v$" />
                    <BaseInput class="" type="date" tooltip="Hasta" name="date_end" :max="maxDate" v-model="form.date_end"
                        :validator="v$" />
                </div>
            </div>
    
            <BaseSelect label="NAC" tooltip="NAC" placeholder="Seleccione" name="nac_id" v-model="form.nac_id"
                :options="options.nacs" :validator="v$" :allowEmpty="false" />
            <BaseSelect label="ESTADO" tooltip="ESTADO" placeholder="Seleccione" name="status" v-model="form.status"
                :options="options.status" :validator="v$" :allowEmpty="false" />
            <BaseSelect label="TIPO" tooltip="TIPO" placeholder="Seleccione" name="type" v-model="form.type"
                :options="itemSelects" :validator="v$" :allowEmpty="false" />
            <BaseSelect label="MONITOR" tooltip="Ingrese el Monitor" placeholder="Seleccione" name="user_id"
                :options="options.monitors" v-model="form.user_id" :validator="v$" />
            <div class="flex flex-col justify-start h-full">
                <label for="regular-form-2" class="form-label font-bold min-w-max ">ACCIONES</label>
                <div class="grid grid-cols-2 gap-6 w-full intro-x">
                    <button class="btn btn-primary w-full" type="button" @click="searchInfoReport()">Buscar</button>
                    <button class="btn btn-warning text-white w-full" type="button" @click="cleanFilter()">Limpiar</button>
    
                </div>
            </div>
    
            <div class="flex flex-col justify-start h-full">
                <label for="regular-form-2" class="form-label font-bold min-w-max ">CANTIDAD DE REGISTRADOS</label>
                <input class="form-control text-center text-danger py-[9px]" :value="services_report.count.value"
                    placeholder="CANTIDAD DE REGISTRADOS" disabled />
            </div>
        </section>
    </div>
    <!-- </div> -->
    <div class="intro-y box p-5 mt-5">
        <div class="overflow-x-auto">
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th v-for="header in headers" class="whitespace-nowrap">{{ header.text }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in items">
                        <td class="whitespace-nowrap">{{ item.id }}</td>
                        <td class="whitespace-nowrap">{{ item.name }}</td>
                        <td v-if="item.pdf" class="whitespace-nowrap"><a class="btn btn-danger"
                                @click="exportPdf(item.type, item.id)" target="_blank">
                                <DownloadIcon class="w-4 h-4 text-white" />
                            </a></td>
                        <td class="whitespace-nowrap" v-if="item.excel">
                            <a class="btn btn-success" @click="exportExcel(item.type, item.id)" target="_blank">
                                <DownloadIcon class="w-4 h-4 text-white" />
                            </a>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

</template>