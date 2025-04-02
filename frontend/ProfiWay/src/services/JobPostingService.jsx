import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export async function getJobPostingInfo(user) {
  try {
    const response = await axios.get(
      `${API_URL}/api/JobPostings/getbyuserid?id=${user.id}`,
      {
        headers: { Authorization: `Bearer ${user.token}` },
      }
    );

    if (response.data) {
      return {
        title: response.data.title || "",
        description: response.data.description || "",
        companyId: response.data.companyId || "",
        cityId: response.data.cityId || "",
        //applications: response.data.applications || ""
      };
    }
  } catch (error) {
    if (error.response.status === 404) {
      console.warn("İş ilanı bilgileri bulunamadı.");
      return "";
    } else {
      console.error("Bir hata oluştu:", error);
    }
  }
}
