import axiosInstance from "@/plugins/axios";
import alerts from "@/utils/alerts";
import { setLoading } from "@/utils/loading";

const module = "get-data-selects";
const apiPath = import.meta.env.VITE_API_PATH;

export default function selectServices() {
  const data = reactive({
    all: [],
    one: {},
  });

  const errors = ref("");

  const getSelectAll = async () => {
    try {
      setLoading(true);
      let response = await axiosInstance
        .get(`/${apiPath}/${module}`)
        .finally(() => {
          setLoading(false);
        });
      if (response.status === 200) {
        data.all = response.data;
      }
    } catch (e) {
      alerts.custom_validation(e.response.data.error ?? e.response.data.message);
    }
  };

  return {
    data,
    errors,
    getSelectAll,
  };
}
// export default{
//   getSelectAll() {
//     return axiosInstance.get(`/${apiPath}/${module}`).then(function (response) {
//     }).catch(function (error) {

//     });
//   }

// }
