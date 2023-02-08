<script setup>
import { scroll_top } from "@/utils/scroll";
import { useVuelidate } from "@vuelidate/core";
import ConsecutiveService from "@/services/generals.service";
import get_status from "@/utils/get_status";
import PedagogicalsService from "@/services/pedagogical.service";

// Importing Store
import { storeToRefs } from "pinia";
import { useMethodologicalSheetsTwo } from "@/stores/methodologicalSheetsTwo";

// Importing Options Store
import { useSelectStore } from "@/stores/selects";

// Importing Components
import BaseInput from "@/components/base/Input.vue";
import BaseSelect from "@/components/base/Select.vue";
import BaseRadio from "@/components/base/Radio.vue";
import BaseBackButton from "@/components/base/BaseBackButton.vue";
import BaseTextarea from "@/components/base/Textarea.vue";
import Management from "@/components/base/Management.vue";
import BaseFilepond from '@/components/base/Filepond.vue'
import Aggregates from "@/components/base/Aggregates.vue"


import Swal from "sweetalert2";
import permissions from "@/permissions";
import mixins from "@/mixins";
import { loading } from "@/utils/loading";
import StateHeader from "@/components/base/StateHeader.vue";
import { useOnboardingStore } from "@/stores/onboarding";

// Extracting Store Data
const store = useMethodologicalSheetsTwo()
const { form, form_rules, form_options } = storeToRefs(store)

// Extracting Store Data
const select_store = useSelectStore();
const { options } = storeToRefs(select_store);

/* const form = reactive({
  cultural_seedbed_name: "",
  start_date: "",
  final_date: "",
}); */

// Using Vuelidate (with Store form & form)
const v$ = useVuelidate(form_rules, form, { $autoDirty: true, $lazy: true });

// Extracting Services
const pedagogicals_services = PedagogicalsService();
const consecutive_services = ConsecutiveService();

const route = useRoute();
const files = reactive({
  I: [],
  II: [],
  aforo_pdf: []
});
const beneficiaries_headers = [
  {
    text: 'ID',
    value: 'id',
  },
  {
    text: 'NOMBRE',
    value: 'full_name',
  },
  {
    text: 'CÉDULA',
    value: 'nuip',
  }
]

const editing = computed(() => {
  return route.params.id ? true : false;
});

const fetch_consecutive = async () => {
  return await consecutive_services
    .getConsecutive("pedagogicals", "FP")
    .then(() => {
      form.value.consecutive = consecutive_services.data.value;
    });
};

const fetch_pedagogical = async () => {
  return await pedagogicals_services.getOne(route.params.id);
};

const aggregates_conditions = computed(() => {
  const type = form.value.activity_type;
  if (!type) {
    return 0;
  }

  if (type === 'E' || type === 'C') {
    return 1
  }

  return 2;

})

onMounted(async () => {
  if (editing.value) {
    store.$reset();
    await fetch_pedagogical()
      .then(() => {
        const {
          created_at,
          id,
          monitor,
          nac,
          orientation,
          status,
          reject_message,
          user_id,
          ...rest
        } = pedagogicals_services.data.one;

        store.$patch((state) => {
          Object.assign(state.form, rest);
          state.update_instance.consecutive = rest.consecutive;
          state.update_instance.status = status;
          state.update_instance.reject_message = reject_message;
        });
      })
      .catch(() => {
        mixins.not_found_by_id();
      });
  } else {
    store.$reset();
    v$.value.$reset();
    await fetch_consecutive();
  }
});

const onSubmit = async () => {
  const valid = await v$.value.$validate();

  if (valid) {
    if (editing.value) {
      await pedagogicals_services.update(
        pedagogicals_services.data.one.id,
        form.value
      );
    } else {
      await pedagogicals_services
        .create({ ...form.value, user_id: useOnboardingStore().get_user.id })
        .then(async (response) => {
          if (response.data.items) {
            store.$reset();
            v$.value.$reset();
            scroll_top();
            await fetch_consecutive();
          }
        });
    }
  } else {
    Swal.fire(
      "Validación",
      "Por favor valide los campos solicitados.",
      "error"
    );
  }
};

const addFile = (err, val, number) => {
  if (err) {
    return
  }
  else {
    const { file } = val
    if (number == 1) {
      form.value.development_activity_image = file
    }
    if (number == 2) {
      form.value.evidence_participation_image = file
    }
    if (number == 3) {
      form.value.aforo_pdf = file
    }
  }
}

const removeFile = (number) => {
  if (number == 1) {
    form.value.development_activity_image = null
    files.I = []
  }
  if (number == 2) {
    form.value.evidence_participation_image = null
    files.II = []
  }
  if (number == 3) {
    form.value.aforo_pdf = null
    files.aforo_pdf = []
  }

}
</script>

<template>
  <div class="max-w-screen-full mx-auto">
    <div class="intro-y flex justify-between items-start md:items-end mt-5">
      <div class="intro-y flex flex-col items-start gap-1">
        <BaseBackButton />
        <h2 class="text-lg font-medium mr-auto">
          {{
  editing
  ? `Edición de Ficha Pedagógica #${pedagogicals_services.data.one.id}`
          : `Ficha Metodológica de Planeación`
          }}
        </h2>
      </div>
      <StateHeader :consecutive="form.consecutive" :reject_message="store.update_instance.reject_message"
        :status="store.update_instance.status" />
    </div>
    <Management v-if="editing ? permissions.pedagogicals.management() : false" @send="
      (payload) =>
        mixins.methods.send_management(
          'pedagogicals',
          pedagogicals_services.data.one.id,
          payload
        )
    " class="mt-5" />
    <div class="intro-y box mt-5">
      <fieldset :disabled="permissions.pedagogicals.no_edit()">
        <form @submit.prevent="onSubmit" class="p-5 border-t border-slate-200/60">
          <div class="flex flex-col lg:grid lg:grid-cols-2 xl:grid xl:grid-cols-2 gap-6 justify-evenly mt-5">
            <BaseSelect label="TIPO ACTIVIDAD *" tooltip="" placeholder="Tipo de la actividad"
              :options="options.activity_type" name="activity_type" v-model="form.activity_type" :validator="v$" />
            <BaseInput type="date" label="FECHA *" tooltip="" name="date_range" v-model="form.date_range"
              :validator="v$" />
          </div>

          <div class="flex flex-col lg:grid lg:grid-cols-2 xl:grid xl:grid-cols-2 gap-6 justify-evenly mt-5">
            <BaseTextarea label="ACTORES CLAVES DE LA COMUNIDAD PARTICIPANTE *" tooltip="" :rows="3"
              name="keyactors_participating_community" v-model="form.keyactors_participating_community"
              :validator="v$" />
            <BaseTextarea label="OBJETIVO DEL PROCESO *" tooltip="" placeholder="Objetivo del proceso"
              name="objective_process" v-model="form.objective_process" :validator="v$" rows="3" required />
          </div>

          <div class="flex flex-col lg:grid lg:grid-cols-2 xl:grid xl:grid-cols-2 gap-6 justify-evenly mt-5">
            <BaseRadio label="¿SE ALCANZÓ EL OBJETIVO? *" tooltip="" name="reached_target" v-model="form.reached_target"
              :options="form_options.reached_target" :validator="v$" required />
            <BaseInput type="number" label="CANTIDAD DE PARTICIPANTES *" tooltip="" name="participants_number"
              v-model="form.participants_number" :validator="v$" />
          </div>

          <div class="flex flex-col lg:grid lg:grid-cols-1 xl:grid xl:grid-cols-1 gap-6 justify-evenly mt-5">
            <BaseTextarea label="SUSTENTE *" tooltip="" placeholder="Sustentación" name="sustein" v-model="form.sustein"
              :validator="v$" rows="3" required />
          </div>

          <div class="w-full intro-x grid grid-cols-1 md:grid-cols-2 gap-6 justify-evenly mt-5">
            <BaseFilepond label="FOTO DEL DESARROLLO *" tooltip="Arrastra un archivo valido"
              name="development_activity_image" ref="development_activity_image"
              v-model="form.development_activity_image" @addfile="(err, val) => addFile(err, val, 1)"
              @removefile="removeFile(1)" :files="files.I" :accept_pdf="true" :validator="v$" />

            <BaseFilepond label="EVIDENCIA DE PARTICIPACIÓN *" tooltip="Arrastra un archivo valido"
              name="evidence_participation_image" ref="evidence_participation_image"
              v-model="form.evidence_participation_image" @addfile="(err, val) => addFile(err, val, 2)"
              @removefile="removeFile(2)" :files="files.II" :accept_pdf="true" :validator="v$" />
          </div>

          
          <div class="w-full intro-x grid grid-cols-2 md:grid-cols-2 gap-6 justify-evenly mt-5"
            v-if="aggregates_conditions === 1">
            <BaseFilepond label="FOTO DEL DESARROLLO *" tooltip="Arrastra un archivo valido" name="aforo_pdf"
              ref="aforo_pdf" v-model="form.aforo_pdf" @addfile="(err, val) => addFile(err, val, 3)"
              @removefile="removeFile(1)" :files="files.aforo_pdf" :accept_pdf="true" :validator="v$" />

            <BaseInput type="number" label="CAPACIDAD (NUMERO DE ASISTENTES) *" tooltip="" name="number_attendees"
              v-model="form.number_attendees" :validator="v$" />
          </div>

          <div class="w-full" v-if="aggregates_conditions === 2">
            <BaseSelect label="GRUPO *" tooltip="Selecciona un grupo" placeholder="Seleccione" name="group_id"
              v-model="form.group_id" :options="options.group_beneficiaries" :validator="v$" />
          </div>
          <section v-if="aggregates_conditions === 2" class="flex flex-col justify-start nt-5">
            <div>
              <h3 class="intro-y form-label font-bold uppercase">
                <span>
                  Asistentes Agregados
                </span>
                <span>
                  # {{ form.aggregates.beneficiaries.length }}
                </span>
              </h3>
            </div>
            <div class="overflow-x-auto overflow-y-hidden">
              <Aggregates @pop="(id) => store.pop_aggregate(id)" @push="(aggregate) => store.push_aggregate(aggregate)"
                :options="options.beneficiaries_table || null" :headers="beneficiaries_headers"
                :aggregates="form.aggregates.beneficiaries" :validator="v$" name="aggregates">
              </Aggregates>
            </div>
          </section>

          <div class="flex justify-center">
            <button :disabled="loading" type="submit" class="btn btn-primary w-24 mr-1 mb-2">
              Ingresar
            </button>
          </div>
        </form>
      </fieldset>
    </div>
  </div>
</template>
