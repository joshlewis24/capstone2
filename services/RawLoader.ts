// services/loaderdataapi.ts
import axios from "axios";

const loaderDataApi = axios.create({
  baseURL: "http://192.168.254.54:8085", // backend host
});

// API methods
export default {
  // POST: Upload loader data
  uploadLoaderData: async (partnerId: string, configId: string, file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await loaderDataApi.post(
        `/api/partners/${partnerId}/configs/${configId}/loader-data/upload`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      console.log("Loader Data Upload Success:", response.data);
      return response.data;
    } catch (error: any) {
      console.error(
        "Loader Data Upload Error:",
        error?.response?.data || error?.message
      );
      throw error;
    }
  },
};
