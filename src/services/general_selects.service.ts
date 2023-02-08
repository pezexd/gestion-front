import { setLoading } from "@/utils/loading";
import axiosInstance from "@/plugins/axios";
import alerts from "@/utils/alerts";
const apiPath = import.meta.env.VITE_API_PATH;

interface data {
    roles: { [key: string]: any }[]
    users: { [key: string]: any }[]
}

let data = reactive<data>({
    roles: [],
    users: [],
})

const getRoles = async (nac_id: string | number) => {
    try {
        if (nac_id == '') {
            nac_id = 0
        }
        setLoading(true);
        let response = await axiosInstance
            .get(`/${apiPath}/getRole/${nac_id}`)
            .finally(() => {
                setLoading(false);
            });

        if (response.status == 200) {
            data.roles = response.data.items
            console.log(data.roles)
        }
        return response;
    } catch (e) {
        alerts.custom('Error', e.response.data.error ?? e.response.data.message, 'error')
    }
}

const getUsers = async (role_id: string | number) => {
    try {
        if (role_id == '') {
            role_id = 0
        }
        setLoading(true)
        let response = await axiosInstance
            .get(`/${apiPath}/getUser/${role_id}`)
            .finally(() => {
                setLoading(false)
            })

        if (response.status == 200) {
            data.users = response.data.items
        }
        return response
    } catch (e) {
        alerts.custom('Error', e.response.data.error ?? e.response.data.message, 'error')
    }
}

export default {
    data,
    getRoles,
    getUsers
}
