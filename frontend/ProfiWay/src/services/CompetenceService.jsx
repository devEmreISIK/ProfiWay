import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export async function getAllCompetences(user) {
  try {
    const response = await axios.get(`${API_URL}/api/Competences/getall`, {
      headers: { Authorization: `Bearer ${user.token}` },
    });

    if (response.data) {
      return response.data.map((comp) => ({
        value: comp.id,
        label: comp.name,
      }));
    }
  } catch (error) {
    if (error.response.status === 404) {
      console.warn("Yetkinlik bilgileri bulunamadı.");
      return "";
    } else {
      console.error("Bir hata oluştu:", error);
    }
    return null;
  }
}
