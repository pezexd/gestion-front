import { defineStore } from "pinia";
import { required } from '@vuelidate/validators'

export const useProfile = defineStore("profile", {
    state: () => ({
        form: {
            'user_id': '',
            'contractor_full_name': '',
            'nac_id': '',
            'document_number': '',
            'role_id': null,
            'gestor_id': null,
            'psychosocial_id': null,
            'methodological_support_id': null,
            'support_tracing_monitoring_id': null,
            'ambassador_leader_id': null,
            'instructor_leader_id': null,
        },
        form_rules: {
            'user_id': {},
            'contractor_full_name': { required },
            'nac_id': { required },
            'document_number': { required },
            'role_id': { required },
            'psychosocial_id': {},
            'gestor_id': {},
            'methodological_support_id': {},
            'support_tracing_monitoring_id': {},
            'ambassador_leader_id': {},
            'instructor_leader_id': {},
        },
        validator: {
            generalData: false,
            beneficiary_list: false,
        }
    }),
    getters: {
    },
    actions: {
        clearInputs() {
            this.$state.form.contractor_full_name = null
            this.$state.form.nac_id = null;
            this.$state.form.document_number = null;
            this.$state.form.role_id = null;
            this.$state.form.gestor_id = null;
            this.$state.form.psychosocial_id = null;
            this.$state.form.methodological_support_id = null;
            this.$state.form.support_tracing_monitoring_id = null;
            this.$state.form.instructor_leader_id = null;
            this.$state.form.ambassador_leader_id = null;
        },
        fillInputs(data) {
            const profile = data.profile;

            if (profile) {

                this.$state.form.contractor_full_name = profile.contractor_full_name || "";
                this.$state.form.nac_id = profile.nac_id || "";
                this.$state.form.document_number = profile.document_number || "";
                this.$state.form.role_id = profile.role?.slug;
                this.$state.form.gestor_id = profile.gestor_id;
                this.$state.form.support_tracing_monitoring_id = profile.support_tracing_monitoring_id;
                this.$state.form.psychosocial_id = profile.psychosocial_id;
                this.$state.form.ambassador_leader_id = profile.ambassador_leader_id;
                this.$state.form.instructor_leader_id = profile.instructor_leader_id;
                this.$state.form.methodological_support_id = profile.methodological_support_id;
                /* 
                */
            }
        }
    }
})