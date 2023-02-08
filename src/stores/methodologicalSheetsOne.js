import { defineStore } from "pinia";
import { required, checkMinMaxHours, minLength } from '../utils/validations'
export const useMethodologicalSheetsOne = defineStore("methodologicalSheets", {
    state: () => ({
        form: {
            semillero_name: '',
            date_range: '',
            filter_level: '',
            worked_expertise: '',
            characteristics_process: '',
            objective_process: '',
            comments: '',
            group_id: '',
            cultural_right_id: '',
            orientation_id: '',
            value: '',
            lineament_id: ''

        },
        form_rules: {
            semillero_name: { required },
            date_range: { required },
            filter_level: { required },
            worked_expertise: { required },
            characteristics_process: { required },
            objective_process: { required },
            comments: { required },
            group_id: { required },
            cultural_right_id: { required },
            orientation_id: { required },
            value: { required },
            lineament_id: { required }
        },
        form_options: {

        },
    }),
    getters: {

    },
    actions: {
        clear() {
            this.$state.form.semillero_name = '';
            this.$state.form.date_range = '';
            this.$state.form.filter_level = '';
            this.$state.form.worked_expertise = '';
            this.$state.form.characteristics_process = '';
            this.$state.form.objective_process = '';
            this.$state.form.comments = '';
            this.$state.form.group_id = '';
            this.$state.form.cultural_right_id = '';
            this.$state.form.orientation_id = '';
            this.$state.form.value = '';
            this.$state.form.lineament_id = '';
        }
    }
})