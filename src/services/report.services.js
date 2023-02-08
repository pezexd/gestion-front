import { setLoading } from "@/utils/loading";
import dayjs from 'dayjs'
import alerts from "@/utils/alerts";
import axiosInstance from "@/plugins/axios";

const apiPath = import.meta.env.VITE_API_PATH
const module = "exports"

export default function roleService() {

    const data = ref([])
    const dataOne = ref([])
    const errors = ref('')
    const count = ref(0)
    const date = ref(dayjs().format('DD_MM_YYYY'))
    const exportExcel = async (type, form) => {
        try {
            setLoading(true)
            await axiosInstance.post(`/${apiPath}/${module}/excel/${type}`, form, {
                responseType: 'blob'
            }).then((response) => {
                const url = URL.createObjectURL(new Blob([response.data], {
                    type: 'application/vnd.ms-excel'
                }))

                const link = document.createElement('a')
                link.href = url
                link.setAttribute('download', type + '_' + date.value)
                document.body.appendChild(link)
                link.click()
                alerts.general('Se ha descargado correctamenta');
            })
                .finally(() => {
                    setLoading(false)
                })

        } catch (e) {
            console.log('ex', e)
            if (e.response.status === 404) {
                alerts.info('Algo salio mal en la exportación');
            } else {
                alerts.custom_validation(e.response.data.error ?? e.response.data.message);
            }

        }

    }

    const exportPdf = async (type, form) => {
        try {
            setLoading(true)
            let response = await axiosInstance.post(`/${apiPath}/${module}/pdf/${type}`, form)
                .then((response) => {
                    const url = window.URL.createObjectURL(new Blob([response.data]))
                    const link = document.createElement('a')
                    link.href = url
                    link.setAttribute('download', type + '_' + date.value + '.pdf')
                    document.body.appendChild(link)
                    link.click();
                })
                .finally(() => {
                    setLoading(false)
                });
            if (response.status === 201) {
                Toast(response.data.message);
            }

        } catch (e) {
            if (e.response.status === 400) {
                alerts.info(e.response.data.message);
            }
            else {
                alerts.custom_validation(e.response.data.error ?? e.response.data.message);
            }
        }
    }

        const searchInfoReport = async (form) => {
            try {
                setLoading(true)
                let response = await axiosInstance.post(`/${apiPath}/${module}/excel`, form)
                    .finally(() => {
                        setLoading(false)
                    })
                if (response.status === 200) {
                    count.value = response.data.count
                }
            } catch (e) {
                alerts.custom_validation(e.response.data.error ?? e.response.data.message);;
            }
        }

        return {
            data,
            errors,
            exportExcel,
            exportPdf,
            searchInfoReport,
            count
        }
    }