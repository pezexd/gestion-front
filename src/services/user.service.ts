import axiosInstance from "@/plugins/axios"
import alerts from "@/utils/alerts"
import { setLoading } from "@/utils/loading"

const module = "users";
const apiPath = import.meta.env.VITE_API_PATH;


export default function userservice() {
	const data = reactive({
		all: [],
		one: {},
		no_paginate: [],
		user_id: null
	})
	const router = useRouter()
	const errors = ref('')

	const get = async () => {
		try {
			setLoading(true)
			let response = await axiosInstance.get(`/${apiPath}/${module}`).finally(() => {
				setLoading(false)
			});
			if (response.status === 200) {
				data.all = response.data.items;
			}
		} catch (e) {
			alerts.custom_validation(e.response.data.error ?? e.response.data.message);
		}
	}
	const usersNoPaginate = async () => {
		try {
			setLoading(true)
			let response = await axiosInstance.get(`/${apiPath}/${'usersNoPaginate'}`).finally(() => {
				setLoading(false)
			})
			if (response.status === 200) {
				data.no_paginate = response.data.items;
			}
		} catch (e) {
			alerts.custom_validation(e.response.data.error ?? e.response.data.message);
		}
	}

	const getOne = async (id) => {
		try {
			setLoading(true);
			let response = await axiosInstance
				.get(`/${apiPath}/${module}/${id}`)
				.finally(() => {
					setLoading(false);
				});
			if (response.status === 200) {
				data.one = response.data.items;
			}
		} catch (e) {
			alerts.custom_validation(e.response.data.error ?? e.response.data.message);;
		}
	};

	const create = async (payload) => {
		errors.value = "";

		try {
			setLoading(true);
			const response = await axiosInstance
				.post(`/${apiPath}/${module}`, payload)
				.finally(() => {
					setLoading(false);
				});
			if (response.status === 200) {
				data.user_id = response.data.items.id;
				// router.push({ name: 'users.index' })
			}
			return response;
		} catch (e) {
			alerts.custom_validation(e.response.data.error ?? e.response.data.message);
		}
	};

	const update = async (id, payload) => {
		errors.value = "";
		try {
			setLoading(true);
			const response = await axiosInstance
				.put(`/${apiPath}/${module}/${id}`, payload)
				.finally(() => {
					setLoading(false);
				});
			if (response.status == 200) {
				router.push({ name: "users.index", params: {} });
			}
		} catch (e) {
			alerts.custom_validation(e.response.data.error ?? e.response.data.message);
		}
	};

	const destroy = async (id) => {
		try {
			setLoading(true);
			const response = await axiosInstance
				.delete(`/${apiPath}/${module}/${id}`)
				.finally(() => {
					setLoading(false);
				});
			if (response.status === 200) await router.push({ name: "users.index" });
		} catch (e) {
			alerts.custom_validation(e.response.data.error ?? e.response.data.message);
		}
	};
	const changePassword = async (payload) => {
		errors.value = "";

		try {
			setLoading(true);
			const response = await axiosInstance.post(`/${apiPath}/users/changePassword`, payload)
				.finally(() => {
					setLoading(false);
				});
			return response;
		} catch (e) {
			alerts.custom_validation(e.response.data.error ?? e.response.data.message);
		}
	};

	const changeStatus = async (payload) => {
		errors.value = "";
		try {
			setLoading(true);
			const response = await axiosInstance.post(`/${apiPath}/users/changeStatus`, payload)
				.finally(() => {
					setLoading(false);
				});
			return response;
		} catch (e) {
			alerts.custom_validation(e.response.data.error ?? e.response.data.message);
		}
	};

	return {
		data,
		errors,
		get,
		getOne,
		update,
		create,
		destroy,
		usersNoPaginate,
		changePassword,
		changeStatus
	};
}
