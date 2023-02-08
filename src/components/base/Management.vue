<script setup lang="ts">
import { required } from '@/utils/validations'
import { storeToRefs } from 'pinia';
import { useSelectStore } from '@/stores/selects'
import { useVuelidate } from '@vuelidate/core'
import alerts from '@/utils/alerts';
import BaseSelect from '@/components/base/Select.vue'
import BaseTextarea from '@/components/base/Textarea.vue'
import BaseFilepond from '@/components/base/Filepond.vue'
import mixins from '@/mixins'

const { options } = storeToRefs(useSelectStore())
const route = useRoute()

const statuses = computed(() => {
    let handle_status = options.value.status
    const { is_role, is_slug } = mixins.computed

    if (is_role('apoyo_seguimiento_monitoreo')) {
        if (is_slug('binnacles', route)) {
            return handle_status.filter(status => status.value === 'REV' || status.value === 'REC')
        }
        else if (is_slug('binnacleManagers', route)) {
            return handle_status.filter(status => status.value === 'REV' || status.value === 'REC')
        }
        else if (is_slug('inscriptions', route)) {
            return handle_status.filter(status => status.value === 'APRO' || status.value === 'REC')
        }
    }
    else if (is_role('gestores_culturales') || is_role('lider_instructor')) {
        if (is_slug('pecs', route)) {
            return handle_status.filter(status => status.value === 'APRO' || status.value === 'REC')
        }
        else if (is_slug('pedagogicals', route)) {
            return handle_status.filter(status => status.value === 'APRO' || status.value === 'REC')
        }
        else if (is_slug('binnacles', route)) {
            return handle_status.filter(status => status.value === 'APRO' || status.value === 'REC')
        }
    }
    else if (is_role('lider_embajador')) {
        if (is_slug('binnacles', route)) {
            return handle_status.filter(status => status.value === 'APRO' || status.value === 'REC')
        }
    }
    else if (is_role('apoyo_metodologico')) {
        if (is_slug('dialoguetables', route)) {
            return handle_status.filter(status => status.value === 'APRO' || status.value === 'REC')
        }
        else if (is_slug('methodologicalInstructions', route)) {
            return handle_status.filter(status => status.value === 'APRO' || status.value === 'REC')
        }
        else if (is_slug('binnacles', route)) {
            return handle_status.filter(status => status.value === 'APRO' || status.value === 'REC')
        }
        else if (is_slug('binnacleManagers', route)) {
            return handle_status.filter(status => status.value === 'APRO' || status.value === 'REC')
        }
        else if (is_slug('managermonitorings', route)) {
            return handle_status.filter(status => status.value === 'APRO' || status.value === 'REC')
        }
    }
    else if (is_role('coordinador_psicosocial')) {
        if (is_slug('parentschools', route)) {
            return handle_status.filter(status => status.value === 'APRO' || status.value === 'REC')
        }
        else if (is_slug('psychosocialinstructions', route)) {
            return handle_status.filter(status => status.value === 'APRO' || status.value === 'REC')
        }
        else if (is_slug('psychopedagogicallogs', route)) {
            return handle_status.filter(status => status.value === 'APRO' || status.value === 'REC')
        }
    }
    else if (is_role('subdireccion')) {
        if (is_slug('binnacle_territories', route)){
            return handle_status.filter(status => status.value === 'APRO' || status.value === 'REC')
        }
        else if (is_slug('reportsTerritories', route)){
            return handle_status.filter(status => status.value === 'APRO' || status.value === 'REC')
        }
    }
    else {
        return handle_status
    }
})

const is_files = computed(() => {
    const { is_role, is_slug } = mixins.computed

    return (is_slug('inscriptions', route) && form.status == 'APRO') ? true : false
})

const emit = defineEmits([
    'send'
])

const form = reactive({
    status: '',
    reject_message: '',
    file_1: '',
    file_2: '',
})

const form_rules = computed(() => ({
    status: { required },
    reject_message: (form.status == 'REC') ? { required } : {},
    file_1: (mixins.computed.is_slug('inscriptions', route) && form.status == 'APRO') ? { required } : {},
    file_2: (mixins.computed.is_slug('inscriptions', route) && form.status == 'APRO') ? { required } : {},
}))

const v$ = useVuelidate(form_rules, form, { $scope: false, $stopPropagation: true })

const files = reactive({
    I: [],
    II: []
})

const addFile = (err, val, number) => {
    if (err) {
        return
    }
    else {
        const { file, filename } = val
        if (number == 1) {
            form.file_1 = file
        }
        if (number == 2) {
            form.file_2 = file
        }
    }
}

const removeFile = (number: number) => {
    if (number == 1) {
        form.file_1 = null
        files.I = []
    }
    if (number == 2) {
        form.file_1 = null
        files.II = []
    }
}

const on_submit = async () => {
    const valid = await v$.value.$validate()

    if (valid) {
        emit('send', { management: { ...form } })
    }
    else {
        alerts.validation()
    }
}

</script>

<template>
    <div class="box p-5">
        <form @submit.prevent="on_submit" id="gestor_message" class="flex flex-col items-center gap-6 justify-evenly">
            <div :class="form.status === 'REC' ? 'grid-cols-1 lg:grid-cols-[25%_1fr]' : 'grid-cols-1'"
                class="grid gap-6 justify-evenly w-full">
                <div class="w-full">
                    <BaseSelect label="ESTADO *" tooltip="Selecciona un Estado" placeholder="Seleccione" name="status"
                        v-model="form.status" :options="statuses || null" :validator="v$" />
                </div>
                <div class="w-full intro-x" v-if="form.status === 'REC'">
                    <BaseTextarea rows="3" label="MENSAJE DE RECHAZO " tooltip="Explique el ¿Por qué?"
                        placeholder="Porque..." name="reject_message" v-model="form.reject_message" :validator="v$" />
                </div>
                <div class="w-full intro-x grid grid-cols-1 md:grid-cols-2 gap-6 justify-evenly" v-if="is_files">
                    <BaseFilepond label="VALIDACIÓN DEL PARTICIPANTE (PDF) *" tooltip="Arrastra un pdf" name="file_1"
                        ref="file_ref" v-model="form.file_1" @addfile="(err, val) => addFile(err, val, 1)"
                        @removefile="removeFile(1)" :files="files.I" accept_only_pdf :validator="v$" />
                    <BaseFilepond label="VALIDACIÓN DEL ACUDIENTE (PDF) *" tooltip="Arrastra un pdf" name="file_2"
                        ref="file_ref" v-model="form.file_2" @addfile="(err, val) => addFile(err, val, 2)"
                        @removefile="removeFile(2)" :files="files.II" accept_only_pdf :validator="v$" />
                </div>
            </div>
            <div class="w-full flex justify-end col-span-full">
                <button type="submit" form="gestor_message" class="btn btn-primary w-24 ml-2">
                    Enviar
                </button>
            </div>
        </form>
    </div>
</template>