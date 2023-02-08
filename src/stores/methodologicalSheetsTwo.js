import { defineStore } from "pinia";
import { required, checkMinMaxHours, minLength } from '../utils/validations'
export const useMethodologicalSheetsTwo = defineStore("methodologicalSheetsTwo", {
    state: () => ({
        form: {
            activity_type: '',
            date_range: '',
            keyactors_participating_community: '',
            objective_process: '',
            reached_target: '',
            sustein: '',
            participants_number: '',
            development_activity_image: '',
            evidence_participation_image: '',
            aforo_pdf: '',
            number_attendees: '',
            group_id: '',
            aggregates: {
                beneficiaries: []
            },
            beneficiaries_or_capacity: ''

        },
        form_rules: {
            activity_type: { required },
            date_range: { required },
            keyactors_participating_community: { required },
            objective_process: { required },
            reached_target: { required },
            sustein: { required },
            participants_number: { required },
            development_activity_image: { required },
            evidence_participation_image: { required },
            aforo_pdf: { required },
            number_attendees: { required },
            group_id: {},
            aggregates: {
                beneficiaries: {}
            },
            beneficiaries_or_capacity: {}
        },
        form_options: {
            reached_target: [
                { value: 1, text: 'Si' },
                { value: 0, text: 'No' },
            ],
        },
        update_instance: {
            consecutive: '',
            status: '',
            reject_message: ''
        }
    }),
    getters: {

    },
    actions: {
        clear() {
            this.$state.form.activity_type = '';
            this.$state.form.date_range = '';
            this.$state.form.keyactors_participating_community = '';
            this.$state.form.objective_process = '';
            this.$state.form.reached_target = '';
            this.$state.form.sustein = '';
            this.$state.form.participants_number = '';
            this.$state.form.development_activity_image = '';
            this.$state.form.evidence_participation_image = '';
            this.$state.form.aforo_pdf = '';
            this.$state.form.number_attendees = '';
        },
        push_aggregate(payload) {
            this.$patch(state => {
                state.form.aggregates.beneficiaries.push(payload)
            })
        },
        pop_aggregate(payload) {
            this.$patch(state => {
                const record = state.form.aggregates.beneficiaries.findIndex((item) => item.id === payload)
                state.form.aggregates.beneficiaries.splice(record, 1)
            })
        },
    }
})