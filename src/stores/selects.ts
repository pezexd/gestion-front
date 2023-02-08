import { defineStore } from "pinia";
import service from "../services/selects.service";
const select_service = service();

export interface Select {
  [x: string]: string;
  value: string;
  label: string;
}

interface SelectBeneficiary {
  id: string;
  label: string;
  nuip: string;
}

interface monitors_tableT {
  id: string;
  monitor_fullname: string;
  document_number: string;
}

export interface SelectsState {
  assistants: Select[]
  beneficiaries_table: SelectBeneficiary[]
  beneficiaries: SelectBeneficiary[]
  beneficiary_attrition_factors: Select[]
  binnacles: Select[]
  conditions: Select[]
  cultural_rights: Select[],
  decisions: Select[]
  disabilitis: Select[]
  disability_types: Select[]
  educational_levels: Select[]
  entity_names: Select[]
  ethnicities: Select[]
  expertises: Select[]
  genders: Select[]
  gestors: Select[]
  health_conditions: Select[]
  lineaments: Select[],
  linkage_projects: Select[]
  managers: Select[]
  medical_services: Select[]
  modules: Select[]
  monitors_parentschools: monitors_tableT[]
  monitors_table: monitors_tableT[]
  monitors: Select[]
  nacs: Select[]
  neighborhoods: Select[]
  orientations: Select[]
  participant_types: Select[]
  place_types: Select[]
  relationships: Select[],
  roles: Select[]
  roles_display: Select[]
  status: Select[]
  stratums: Select[]
  type_documents: Select[]
  users_table: Select[]
  zones: Select[],
  disease_types: Select[];
  marital_status: Select[];
  pecs: Select[]
  pedagogicals: Select[]
  relationship_households: Select[];
  single_registry_victims: Select[];
  groups: Select[];
  group_beneficiaries: Select[];
  values: Select[];
  filter_level: Select[];
  activity_type: Select[];
}

export const useSelectStore = defineStore("selects", {
  state: () => ({
    options: useStorage("options", <SelectsState>{}),
  }),
  actions: {
    async dataSelects(force: boolean) {

      if (this.options) {
        await select_service.getSelectAll()
      }

      this.$patch((state) => {
        state.options = select_service.data.all;

        const monitors_mapped = toRaw(state.options.monitors_table).map(
          ({ id, profile }) => {
            return {
              id,
              monitor_fullname: profile.contractor_full_name,
              document_number: profile.document_number,
              nac_id: profile.nac_id,
              role_id: profile.role_id
            };
          }
        );
        state.options.monitors_table = monitors_mapped;

        const mons = state.options.monitors_table.filter((monitor) => monitor.role_id == 14).map(
          ({ id, monitor_fullname }) => {
            return {
              value: id,
              label: monitor_fullname
            }
          }
        )
        state.options.monitors = mons

        const monitors_parentschools_mapped = toRaw(state.options.monitors_parentschools).map(({ id, profile }) => {
          return {
            value: id,
            label: profile.contractor_full_name,
          }
        })
        state.options.monitors_parentschools = monitors_parentschools_mapped

        const users_mapped = toRaw(state.options.users_table).map(({ id, name, profile }) => {
          if (profile != null) {
            return {
              id,
              name: profile.contractor_full_name,
              document_number: profile.document_number
            }
          }
          else {
            return {
              id,
              name: name,
              document_number: 'No encontrado'
            }
          }
        })

        state.options.users_table = users_mapped;
      });


      // 	this.$patch(state => {
      // 		state.options = response.data

      // 		const monitors_mapped = toRaw(state.options.monitors_table).map(({ id, profile }) => {
      // 			return {
      // 				id,
      // 				monitor_fullname: profile.contractor_full_name,
      // 				document_number: profile.document_number
      // 			}
      // 		})
      // 		state.options.monitors_table = monitors_mapped

      // 		const users_mapped = toRaw(state.options.users_table).map(({ id, name, profile }) => {
      // 			if (profile != null){
      // 				return {
      // 					id,
      // 					name: profile.contractor_full_name,
      // 					document_number: profile.document_number
      // 				}
      // 			}
      // 			else {
      // 				return {
      // 					id,
      // 					name: name,
      // 					document_number: 'No encontrado'
      // 				}
      // 			}
      // 		})

      // 		state.options.users_table = users_mapped
      // 	})
      // if (response.status === 200){
      // 	this.$patch(state => {
      // 		state.options = response.data

      // 		const monitors_mapped = toRaw(state.options.monitors_table).map(({ id, profile }) => {
      // 			return {
      // 				id,
      // 				monitor_fullname: profile.contractor_full_name,
      // 				document_number: profile.document_number
      // 			}
      // 		})
      // 		state.options.monitors_table = monitors_mapped

      // 		const users_mapped = toRaw(state.options.users_table).map(({ id, name, profile }) => {
      // 			if (profile != null){
      // 				return {
      // 					id,
      // 					name: profile.contractor_full_name,
      // 					document_number: profile.document_number
      // 				}
      // 			}
      // 			else {
      // 				return {
      // 					id,
      // 					name: name,
      // 					document_number: 'No encontrado'
      // 				}
      // 			}
      // 		})

      // 		state.options.users_table = users_mapped
      // 	})
      // }
      // if (force) {
      // 	let response = await service.getSelectAll();
      // 	if (response.status === 200) {
      // 		this.options = response.data;

      // 		localStorage.setItem('options', JSON.stringify(response.data));
      // 	}
      // }

      // let options = localStorage.getItem('options');
      // if (options) {
      // 	this.options = JSON.parse(options);
      // } else {
      // 	let response = await service.getSelectAll();
      // 	if (response.status === 200) {
      // 		this.options = response.data;

      // 		localStorage.setItem('options', JSON.stringify(response.data));
      // 	}

      // }
    },
  },
});
