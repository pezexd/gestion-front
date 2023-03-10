<script setup>
import { scroll_top } from '@/utils/scroll'
import { useVuelidate } from '@vuelidate/core'
import ConsecutiveService from '@/services/generals.service'
import get_status from '@/utils/get_status'
import PedagogicalsService from '@/services/pedagogical.service'

// Importing Store
import { storeToRefs } from 'pinia'
import { Pedagogical } from '@/stores/pedagogicals'

// Importing Options Store
import { useSelectStore } from '@/stores/selects'

// Importing Components
import BaseInput from '@/components/base/Input.vue'
import BaseSelect from '@/components/base/Select.vue'
import BaseBackButton from "../../../components/base/BaseBackButton.vue";
import BaseTextarea from '@/components/base/Textarea.vue'
import Management from '@/components/base/Management.vue'
import axiosInstance from "@/plugins/axios";
import Swal from 'sweetalert2'
import permissions from '@/permissions'
import mixins from '@/mixins'
import { loading } from '@/utils/loading'
import StateHeader from '@/components/base/StateHeader.vue'
import { useOnboardingStore } from '@/stores/onboarding'

// Extracting Store Data
const pedagogicals_store = Pedagogical()
const { form, form_rules, form_options } = storeToRefs(pedagogicals_store)

// Extracting Store Data
const select_store = useSelectStore()
const { options } = storeToRefs(select_store)

// Using Vuelidate (with Store form & form)
const v$ = useVuelidate(form_rules, form, { $autoDirty: true, $lazy: true })

// Extracting Services
const pedagogicals_services = PedagogicalsService()
const consecutive_services = ConsecutiveService()

const route = useRoute()

const editing = computed(() => {
    return (route.params.id) ? true : false
})

const fetch_consecutive = async () => {
    return await consecutive_services.getConsecutive('pedagogicals', 'FP').then(() => {
        form.value.consecutive = consecutive_services.data.value
    })
}

const fetch_pedagogical = async () => {
    return await pedagogicals_services.getOne(route.params.id)
}

onMounted(async () => {
    if (editing.value) {
        pedagogicals_store.$reset()
        await fetch_pedagogical().then(() => {
            const { created_at, id, monitor, nac, orientation, status, reject_message, user_id, ...rest } = pedagogicals_services.data.one

            pedagogicals_store.$patch((state) => {
                Object.assign(state.form, rest)
                state.update_instance.consecutive = rest.consecutive
                state.update_instance.status = status
                state.update_instance.reject_message = reject_message
            })
        }).catch(() => {
            mixins.not_found_by_id()
        })
    }
    else {
        pedagogicals_store.$reset()
        v$.value.$reset()
        await fetch_consecutive()
    }
})

const onSubmit = async () => {
    const valid = await v$.value.$validate()

    if (valid) {
        if (editing.value) {
            await pedagogicals_services.update(pedagogicals_services.data.one.id, form.value)
        }
        else {
            await pedagogicals_services.create({ ...form.value, user_id: useOnboardingStore().get_user.id }).then(async (response) => {
                if (response.data.items) {
                    pedagogicals_store.$reset()
                    v$.value.$reset()
                    scroll_top()
                    await fetch_consecutive()
                }
            })
        }
    }
    else {
        Swal.fire('Validaci??n', 'Por favor valide los campos solicitados.', 'error')
    }
}

</script>

<template>
    <div class="max-w-screen-full mx-auto">
        <div class="intro-y flex justify-between items-start md:items-end mt-5">
            <div class="intro-y flex flex-col items-start gap-1">
                <BaseBackButton />
                <h2 class="text-lg font-medium mr-auto">
                    {{ (editing) ? `Edici??n de Ficha Pedag??gica #${pedagogicals_services.data.one.id}` : 'Ficha Pedag??gica'
                    }}
                </h2>
            </div>
            <StateHeader :consecutive="form.consecutive" :reject_message="pedagogicals_store.update_instance.reject_message" :status="pedagogicals_store.update_instance.status" />
        </div>
        <Management v-if="(editing) ? permissions.pedagogicals.management() : false" @send="(payload) => mixins.methods.send_management('pedagogicals', pedagogicals_services.data.one.id, payload)" class="mt-5" />
        <div class="intro-y box mt-5">
            <fieldset :disabled="permissions.pedagogicals.no_edit()">
                <form @submit.prevent="onSubmit" class="p-5 border-t border-slate-200/60">
                    <div class="flex flex-col lg:grid lg:grid-cols-2 xl:grid xl:grid-cols-3 gap-6 justify-evenly mb-8">
                        <div>
                            <BaseInput type="text" label="NOMBRE DE ACTIVIDAD *" tooltip=""
                                placeholder="Nombre de actividad..." name="activity_name" v-model="form.activity_name"
                                :validator="v$" />
                        </div>
                        <div>
                            <BaseInput type="date" label="FECHA *" tooltip="" name="activity_date"
                                v-model="form.activity_date" :validator="v$" />

                        </div>
                        <div>
                            <BaseSelect label="EXPERTICIA *" tooltip="" name="expertise_id" v-model="form.expertise_id"
                                :options="options.expertises || null" :validator="v$" />
                        </div>
                        <div>
                            <BaseSelect label="NAC *" @v-on:change="nac($event)" tooltip="" name="nac_id"
                                v-model="form.nac_id" :options="options.nacs || null" :validator="v$" />
                        </div>
                        <div v-if="form.nac_id == 375">
                            <BaseInput type="text" label="OTRO NAC *" tooltip="" placeholder="Otro NAC..." name="nac_id"
                                v-model="form.nac_id" :validator="v$" />
                        </div>
                    </div>

                    <div class="intro-y flex flex-col gap-6 mb-8">
                        <h2 class="font-bold text-lg mr-auto intro-y">Componente metodol??gico</h2>
                        <div class="flex flex-col lg:grid lg:grid-cols-2 xl:grid-cols-3 gap-6 justify-evenly">
                            <div>
                                <BaseSelect label="DERECHOS CULTURALES *" tooltip="" name="cultural_right_id"
                                    v-model="form.cultural_right_id" :options="options.cultural_rights || null"
                                    :validator="v$" />
                            </div>
                            <div>
                                <BaseSelect label="LINEAMIENTOS *" tooltip="" name="lineament_id"
                                    v-model="form.lineament_id" :options="options.lineaments || null" :validator="v$" />
                            </div>
                            <div>
                                <BaseSelect label="ORIENTACIONES *" tooltip="" name="orientation_id"
                                    v-model="form.orientation_id" :options="options.orientations || null"
                                    :validator="v$" />
                            </div>
                            <div class="lg:col-span-2 xl:col-span-3">
                                <BaseTextarea label="OBJETIVO VIVENCIAL *" tooltip=""
                                    placeholder="Objetivo vivencial..." name="experiential_objective"
                                    v-model="form.experiential_objective" :validator="v$" rows="3" required />
                            </div>
                        </div>
                    </div>

                    <div class="intro-y flex flex-col gap-6 mb-8">
                        <h2 class="font-bold text-lg mr-auto intro-y">
                            Etapas y desarrollo de la Macroestructura cultural
                        </h2>
                        <div class="flex flex-col gap-6 justify-evenly">
                            <div>
                                <BaseTextarea label="MANIFESTACI??N CULTURAL A TRABAJAR *" tooltip=""
                                    placeholder="Manifestaci??n cultural a trabajar..." name="manifestation"
                                    v-model="form.manifestation" :validator="v$" rows="3" required />
                            </div>
                            <div>
                                <BaseTextarea label="PROCESO *" tooltip="" placeholder="Proceso..." name="process"
                                    v-model="form.process" :validator="v$" rows="3" required />

                            </div>
                            <div>
                                <BaseTextarea label="PRODUCTO *" tooltip="" placeholder="Producto..." name="product"
                                    v-model="form.product" :validator="v$" rows="3" required />
                            </div>
                            <div>
                                <BaseTextarea label="RECURSOS NECESARIOS PARA EL DESARROLLO DEL PROYECTO *" tooltip=""
                                    placeholder="Recursos necesarios..." name="resources" v-model="form.resources"
                                    :validator="v$" rows="3" required />
                            </div>
                        </div>
                    </div>

                    <div class="flex justify-center">
                        <button :disabled="loading" type="submit" class="btn btn-primary w-24 mr-1 mb-2">Ingresar</button>
                    </div>
                </form>
            </fieldset>
        </div>
    </div>
</template>