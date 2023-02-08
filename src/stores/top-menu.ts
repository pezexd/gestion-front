import { defineStore } from "pinia"
import access_services from "@/services/access.service"
import { useAccessStore } from "./access"
import mixins from "@/mixins"
import modules_monitors from "@/utils/modules_monitors"

export interface module {
	icon: string
	items: module_item[]
	name: string
}
interface permission {
	slug: string
}

export type module_item = {
	icon: string,
	name: string
	route: string,
}

interface menu_item {
	active?: string
	icon: string
	pageName: string
	subMenu: menu_subitem[]
	title: string
}

interface menu_subitem {
	icon: string
	ignore?: boolean
	pageName: string
	subMenu?: sub_menu[]
	title: string
}

type sub_menu = {
	icon: string,
	ignore?: boolean
	pageName: string,
	subMenu?: string
	title: string,
}

interface menu_state {
	menu: menu_item[]
	modules: module[]
	permissions: any[]
	loading: boolean
}

export const useTopMenuStore = defineStore("topMenu", {
	state: () => ({
		menu: [] as menu_item[],
		modules: [],
		permissions: [] as permission[],
		loading: false,
	}),
	actions: {
		async get_menu() {
			this.loading = true
			const { is_role, is_admin } = mixins.computed
			const { getAccess: get_access, getPermissions: get_permissions, getCountDataForm, getPollOnly } = access_services
			let filter_modules: module[] = []

			const map_modules = (modules: module[]) => {
				const map = modules.filter((module) => module.name != 'Dashboard').map((module: module): menu_item => ({
					icon: module.icon,
					pageName: module.name,
					title: module.name,
					subMenu: module.items.map((item: module_item): menu_subitem => ({
						icon: item.icon,
						pageName: item.route,
						title: item.name
					}))
				}))

				return map
			}

			// if (is_role('monitor_cultural') || is_role('instructor')) {
			// 	let counts = reactive({
			// 		monitor: {
			// 			pecs: 0,
			// 			inscriptions: 0,
			// 			pedagogicals: 0,
			// 			binnacles: 0,
			// 			pollDesertions: 0
			// 		},
			// 		polls: 0
			// 	})

			// 	if (this.modules.length == 0) {
			// 		await get_access().then((response) => {
			// 			this.$patch((state: menu_state) => {
			// 				state.modules = response.data.items
			// 				console.log(state.modules)
			// 			})
			// 		})
			// 	}

			// 	await getCountDataForm().then((res) => {
			// 		Object.assign(counts, res.data.items)
			// 		console.log(res.data.items)
			// 	})

			// 	this.modules.forEach((module) => {
			// 		const { icon, name } = module

			// 		let new_module = {
			// 			icon,
			// 			name,
			// 			items: []
			// 		}

			// 		if (is_role('instructor')) {
			// 			if (new_module.name == 'Monitores') {
			// 				new_module.name = 'Instructores'
			// 			}
			// 		}

			// 		module.items.forEach((module_item) => {
			// 			const { route } = module_item

			// 			if (route == 'polls.index') {
			// 				new_module.items.push(module_item)
			// 			}
			// 			else {
			// 				if (counts.polls > 0) {
			// 					if (route == 'groups.index') {
			// 						new_module.items.push(module_item)
			// 					}
			// 					if (route == 'inscriptions.index') {
			// 						new_module.items.push(module_item)
			// 					}

			// 					if (counts.monitor.inscriptions > 0) {
			// 						if (route == 'pecs.index') {
			// 							new_module.items.push(module_item)
			// 						}
			// 					}
			// 					if (counts.monitor.pecs > 0) {
			// 						if (route == 'pedagogicals.index') {
			// 							new_module.items.push(module_item)
			// 						}
			// 					}
			// 					if (counts.monitor.pedagogicals > 0) {
			// 						if (route == 'binnacles.index') {
			// 							new_module.items.push(module_item)
			// 						}
			// 					}
			// 					if (counts.monitor.binnacles > 0) {
			// 						if (route == 'pollDesertions.index') {
			// 							new_module.items.push(module_item)
			// 						}
			// 					}
			// 				}
			// 			}
			// 		})

			// 		if (counts.polls > 0 && new_module.name == 'Monitores' || counts.polls > 0 && new_module.name == 'Instructores') {
			// 			filter_modules.push(new_module)
			// 		}
			// 		else {
			// 			if (new_module.name == 'Caracterización') {
			// 				filter_modules.push(new_module)
			// 			}
			// 		}
			// 	})

			// 	this.$patch((state: menu_state) => {
			// 		state.menu = map_modules(filter_modules)
			// 		state.loading = false
			// 	})
			// }
			// else {
			await get_access().then((response) => {
				this.$patch((state: menu_state) => {
					state.modules = response.data.items
					console.log('módulos', state.modules)
				})
			})

			await get_permissions().then((response) => {
				this.$patch((state: menu_state) => {
					state.permissions = response.data.items
				})
			})
			console.log(this.permissions)
			
			// if (useAccessStore().hasPoll || is_admin()) {
			this.modules.forEach((module) => {
				const { icon, name } = module
				console.log(module);
				let new_module = {
					icon,
					name,
					items: []
				}

				if (is_role('gestores_culturales')
					|| is_role('apoyo_seguimiento_monitoreo')) {
					if (new_module.name == 'Monitores') {
						new_module.name = 'Revisiones Monitores'
					}
				}
				else if (is_role('lider_instructor')) {
					if (new_module.name == 'Monitores') {
						new_module.name = 'Revisiones Instructores #2'
					}
					if (new_module.name == 'Instructores #1') {
						new_module.name = 'Revisiones Instructores #1'
					}
				}
				else if (is_role('lider_embajador')) {
					if (new_module.name == 'Monitores') {
						new_module.name = 'Revisiones Embajadores #2'
					}
				}
				else if (is_role('apoyo_metodologico')) {
					if (new_module.name == 'Gestores') {
						new_module.name = 'Revisiones Gestores'
					}
				}
				else if (is_role('instructor')) {
					if (new_module.name == 'Monitores') {
						new_module.name = 'Instructores #2'
					}
				}
				else if (is_role('embajador')) {
					if (new_module.name == 'Monitores') {
						new_module.name = 'Embajadores'
					}
				}
				else if (is_role('coordinador_seguimiento')) {
					if (new_module.name == 'Coordinación de seguimiento') {
						new_module.name = 'Coordinador de seguimiento'
					}
				}
				else if (is_role('coordinador_metodologico')) {
					if (new_module.name == 'Coordinación de seguimiento') {
						new_module.name = 'Coordinador metodológico'
					}
				}
				else if (is_role('coordinador_administrativo')) {
					if (new_module.name == 'Coordinación de seguimiento') {
						new_module.name = 'Coordinador administrativo'
					}
				}
				else if (is_role('coordinador_psicosocial')) {
					if (new_module.name == 'Coordinación de seguimiento') {
						new_module.name = 'Coordinador psicosocial'
					}
				}else if(is_role('direccion')){
					if (new_module.name == 'Instructores #1') {
						new_module.name = 'Instructores'
					}
					if (new_module.name == 'Monitores') {
						new_module.name = 'Monitores / Embajadores'
					}
				}


				module.items.forEach((module_item) => {
					const { route } = module_item
					this.permissions.forEach((permission) => {
						const { slug } = permission
						if (route == slug) {
							new_module.items.push(module_item)
						}
					})
				})

				filter_modules.push(new_module)
			})
			// }
			// else {
			// 	this.modules.forEach((module) => {
			// 		const { icon, name } = module

			// 		let new_module = {
			// 			icon,
			// 			name,
			// 			items: []
			// 		}

			// 		module.items.forEach((module_item) => {
			// 			const { route } = module_item

			// 			if (route == 'polls.index') {
			// 				new_module.items.push(module_item)
			// 			}
			// 		})
			// 		if (new_module.name == 'Caracterización') {
			// 			filter_modules.push(new_module)
			// 		}
			// 	})
			// }

			this.$patch((state: menu_state) => {
				state.menu = map_modules(filter_modules)
				state.loading = false
			})
			// }
		},
		clear_menu() {
			this.$patch((state: menu_state) => {
				state.menu = []
				state.modules = []
			})
		}
	},
	getters: {
		get_menu_instance: (state) => {
			return state.menu
		}
	},
	persist: true,
});