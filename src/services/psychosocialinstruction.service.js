import axiosInstance from "@/plugins/axios";
import alerts from "@/utils/alerts";
import { setLoading } from "@/utils/loading";
import mixins from "@/mixins";
const module = "psychosocialinstructions";
const apiPath = import.meta.env.VITE_API_PATH;

export default function psychosocialinstructionsServices() {
  const data = reactive({
    all: [],
    one: {},
  });
  const router = useRouter();
  const errors = ref("");

  const get = async () => {
    try {
      setLoading(true);
      let response = await axiosInstance
        .get(`/${apiPath}/${module}`)
        .finally(() => {
          setLoading(false);
        });


      if (response.status === 200) {
        data.all = response.data.items;
      }
    } catch (e) {
      alerts.custom_validation(e.response.data.error ?? e.response.data.message);
    }
  };

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
      return response
    } catch (e) {
      if (e.response.status  === 404) {
        mixins.not_found_by_id();
    }else{
        alerts.custom_validation(e.response.data.error ?? e.response.data.message);
    }
    }
  };

  const create = async (data) => {
    errors.value = "";

    // Creating FormData
    const dt = new FormData();

    const {
      development_activity_image,
      evidence_participation_image,
      added_wizards,
      assistance_monitors,
      ...rest
    } = data;
    for (const [name, value] of Object.entries(rest)) {
      dt.append(name, value);
    }

    dt.append("development_activity_image", development_activity_image.file);
    dt.append(
      "evidence_participation_image",
      evidence_participation_image.file
    );
    dt.append("added_wizards", JSON.stringify(added_wizards));
    dt.append("assistance_monitors", JSON.stringify(assistance_monitors));

    try {
      setLoading(true);
      const response = await axiosInstance
        .post(`/${apiPath}/${module}`, dt, {
          "Content-Type": "multipart/form-data",
        })
        .finally(() => {
          setLoading(false);
        });
      if (response.data.success === true) {
        alerts.create();
      }
      return response;
    } catch (e) {
      alerts.custom_validation(e.response.data.error ?? e.response.data.message);
    }
  };

  const update = async (id, payload) => {
    errors.value = "";

    // Creating FormData
    const dt = new FormData();

    const {
      development_activity_image,
      evidence_participation_image,
      added_wizards,
      assistance_monitors,
      ...rest
    } = payload;

    for (const [name, value] of Object.entries(rest)) {
      dt.append(name, value);
    }

    dt.append("added_wizards", JSON.stringify(added_wizards));
    dt.append("assistance_monitors", JSON.stringify(assistance_monitors));

    if (development_activity_image.file) {
      dt.append("development_activity_image", development_activity_image.file);
    }
    if (evidence_participation_image.file) {
      dt.append(
        "evidence_participation_image",
        evidence_participation_image.file
      );
    }

    try {
      setLoading(true);
      const response = await axiosInstance
        .post(`/${apiPath}/${module}/${id}`, dt, {
          "Content-Type": "multipart/form-data",
        })
        .finally(() => {
          setLoading(false);
        });

      if (response.status == 200) {
        alerts.update();
        router.push({ name: "psychosocialinstructions.index" });
      }
    } catch (e) {
      alerts.custom_validation(e.response.data.message);
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
      if (response.status === 200) {
        alerts.destroy("Instrucción Psicosocial", id);
      }
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
  };
}
