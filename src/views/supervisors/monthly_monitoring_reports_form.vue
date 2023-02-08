<script setup lang="ts">
import { loading } from '@/utils/loading';
import { scroll_top } from "@/utils/scroll";
import type { option } from '@/components/base/Select.vue'
import mixins from '@/mixins';
import permissions from '@/permissions'
import servicesConsecutive from '@/services/generals.service'
import StateHeader from '@/components/base/StateHeader.vue';
import monthlyMonitoringServices from "@/services/monthly_monitoring_reports.service"

// Importing Vuelidate & Rules
import { useVuelidate } from '@vuelidate/core';

// Importing Components
import BaseInput from '@/components/base/Input.vue'
import BaseSelect from '@/components/base/Select.vue'
import BaseTextarea from '@/components/base/Textarea.vue'
import BaseFilepond from '@/components/base/Filepond.vue'
import BaseBackButton from "@/components/base/BaseBackButton.vue"
import Management from '@/components/base/Management.vue'
import alerts from '@/utils/alerts';

// Store
import { useSelectStore } from "@/stores/selects"
import { storeToRefs } from 'pinia';
import { required } from '@/utils/validations';

// Extracting Select Data
const select_store = useSelectStore()
const { options: lists } = storeToRefs(select_store)

// Extracting Services
const services = monthlyMonitoringServices()
const consecutive_services = servicesConsecutive()

// Form
const form = reactive<{ consecutive: string, date: string, file: Blob }>({
    consecutive: '',
    date: '',
    file: null,
})

const form_reset = () => {
    form.consecutive = ''
    form.date = ''
    form.file = null
}

const form_rules = computed(() => ({
    consecutive: { required },
    date: { required },
    file: { required },
}))

// Using Vuelidate (with Store form & form)
const v$ = useVuelidate(form_rules, form, { $autoDirty: true, $lazy: true })

// Images
const file = ref([])

// Images - First Input
const handleAddFirstFile = (err, val) => {
    if (err) return
    const { file } = val
    form.file = file
}
const handleRemoveFirstFile = () => {
    form.file = null
}

const route = useRoute()

const instance = reactive({
    status: '',
    consecutive: '',
    reject_message: ''
})

const editing = computed(() => {
    return (route.params.id) ? true : false
})

const fetch_consecutive = async () => {
    return await consecutive_services.getConsecutive('monthly_monitoring_reports', 'IMS').then(() => {
        form.consecutive = consecutive_services.data.value
        instance.consecutive = consecutive_services.data.value
    })
}

const fetch_report = async () => {
    return await services.getOne(route.params.id)
}

onBeforeMount(async () => {
    if (editing.value) {
        await fetch_report().catch(() => {
            mixins.not_found_by_id()
        })
        console.log(services.data.one)
    }
    else {
        await fetch_consecutive()
    }
})

// Submiting Form
const onSubmit = async () => {
    const valid = await v$.value.$validate()

    if (valid) {
        if (editing.value) {
            await services.update(services.data.one.id, form)
        }
        else {
            await services.create(form).then(async (response) => {
                if (response.data.success) {
                    file.value = []
                    form_reset()
                    v$.value.$reset()
                    scroll_top()
                    // await fetch_consecutive()
                }
            })
        }
    }
    else {
        alerts.validation()
    }
}
</script>

<template>
    <div class="intro-y flex justify-between items-start md:items-end mt-5">
        <div class="intro-y flex flex-col items-start gap-1">
            <BaseBackButton />
            <h2 class="text-lg font-medium mr-auto">
                {{ (editing) ? `Edición de Informe mensual de supervision #${services.data.one.id}` : `Informe mensual de supervision` }}
            </h2>
        </div>
        <StateHeader :consecutive="instance.consecutive" :status="instance.status"
            :reject_message="instance.reject_message" />
    </div>
    <Management class="mt-5" v-if="(editing) ? permissions.coord_superv.management() : false"
        @send="(payload) => mixins.methods.send_management('binnacle_territories', services.data.one.id, payload)" />
    <div class="intro-y box mt-5">
        <fieldset :disabled="permissions.coord_superv.no_edit()">
            <form @submit.prevent="onSubmit" class="p-5 border-t border-slate-200/60 space-y-8">
                <section class="flex flex-col md:grid md:grid-cols-2 gap-6 justify-evenly">
                    <div class="w-full">
                        <BaseInput type="date" label="FECHA *" tooltip="Ingrese la fecha" placeholder="Fecha"
                            name="date" v-model="form.date" :validator="v$" />
                    </div>
                    <div class="w-full">
                        <BaseFilepond label="DOCUMENTO *" tooltip="Arrastra o selecciona un documento WORD, PDF o EXCEL"
                            name="file" ref="file_ref" :to_edit="services.data.one.file"
                            v-model="form.file" @addfile="handleAddFirstFile" @removefile="handleRemoveFirstFile"
                            :files="file" :accept_docs="true" :validator="v$" />
                    </div>
                </section>
                <div class="flex justify-end">
                    <button :disabled="loading" type="submit" class="btn btn-primary w-24 ml-2">
                        Ingresar
                    </button>
                </div>
            </form>
        </fieldset>
    </div>
</template>