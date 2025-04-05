import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export async function getAllCompetences(user) {
  try {
    const response = await axios.get(`${API_URL}/api/Competences/getall`, {
      headers: { Authorization: `Bearer ${user.token}` },
    });

    if (response.data) {
      return response.data.map((c) => ({
        id: c.id,       
        name: c.name,   
        value: c.id,
        label: c.name,
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
