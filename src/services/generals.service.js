import axiosInstance from "@/plugins/axios";
const apiPath = import.meta.env.VITE_API_PATH;
import alerts from "@/utils/alerts";
import { setLoading } from "@/utils/loading";

export default function consecutiveService() {
	const data = ref("");
	const data_beneficiaries = ref("");
	const data_count_form = ref("");
	const dataGroups = ref([]);
	const getConsecutive = async (table, abreviature) => {
		try {
			let response = await axiosInstance.get(
				`/${apiPath}/consecutive/generate/${table}/${abreviature}`
			);

			if (response.status === 200) {
				data.value = response.data;
			}
			return response;
		} catch (e) {
			alerts.custom_validation(e.response.data.error ?? e.response.data.message);
		}
	}

	const getChangeDataModels = async () => {
		try {
			setLoading(true);
			let response = await axiosInstance
				.get(`/${apiPath}/getChangeDataModels`)
				.finally(() => {
					setLoading(false);
				});

			if (response.status === 200) {
				data.value = response.data.items;
			}
		} catch (e) {
			alerts.custom_validation(e.response.data.error ?? e.response.data.message);
		}
	};
	const destroy = async (id) => {
		try {
			setLoading(true);
			const response = await axiosInstance
				.delete(`/${apiPath}/destroyChangeDataModel/${id}`)
				.finally(() => {
					setLoading(false);
				});
			if (response.status == 200) {
				alerts.destroy("Control de data", id);
			}
		} catch (e) {
			errors.value = e.response.data.errors;
			alerts.custom_validation(e.response.data.error ?? e.response.data.message);
		}
	};
	const getGroupBeneficiaries = async (id) => {
		try {

			if (id) {
				setLoading(true);
				let response = await axiosInstance
					.get(`/${apiPath}/getGroupBeneficiaries/${id}`)
					.finally(() => {
						setLoading(false);
					});
				if (response.status === 200) {
					data_beneficiaries.value = response.data.items;
				}
				return response
			}

		} catch (e) {
			setLoading(false);
			data_beneficiaries.value = [];
			alerts.custom_validation(e.response.data.error ?? e.response.data.message);
		}
	};
	const getCountDataForm = async () => {
		try {


			setLoading(true);
			let response = await axiosInstance
				.get(`/${apiPath}/getCountDataForm`)
				.finally(() => {
					setLoading(false);
				});
			console.log('response', response)
			if (response.status === 200) {
				data_count_form.value = response.data.items;
			}
			return response


		} catch (e) {
			setLoading(false);
			data_count_form.value = {
				'monitor': {
					'pecs': 0,
					'instructions': 0,
					'pedagogicals': 0,
					'binnacles': 0,
					'pollDesertion': 0
				},
				'polls':0
			};
			alerts.custom_validation(e.response.data.error ?? e.response.data.message);
		}
	};
	const getGroups = async (module) => {
		try {
			let response = await axiosInstance.get(
				`/${apiPath}/getGroups`
			);
				console.log(' response.data', response.data)
			if (response.status === 200) {
				dataGroups.value = response.data;
			}
			return response;
		} catch (e) {
			alerts.custom_validation(e.response.data.error ?? e.response.data.message);
		}
	};
	return {
		data,
		getConsecutive,
		getChangeDataModels,
		destroy,
		getGroupBeneficiaries,
		data_beneficiaries,
		data_count_form,
		getCountDataForm,
		getGroups,
		dataGroups
	};
}
