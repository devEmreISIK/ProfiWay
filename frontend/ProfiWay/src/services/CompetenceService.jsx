import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export async function getAllCompetences(user) {
  try {
    const response = await axios.get(`${API_URL}/api/Competences/getall`, {
      headers: { Authorization: `Bearer ${user.token}` },
    });

    if (response.data && Array.isArray(response.data)) { 
      return response.data.map((c) => ({
        id: c.id,
        name: c.name,
        value: c.id, 
        label: c.name, 
      }));
    } else {
      console.warn("getAllCompetences: No data or data is not an array.");
      return [];
    }

  } catch (error) {
    if (error.response && error.response.status === 404) { 
      console.warn("Yetkinlik bilgileri bulunamadı (404).");
      return [];
    } else {
      console.error("Yetkinlikler alınırken bir hata oluştu:", error);
      return [];
    }
  }
}



export async function getCompetenceInfo(user, competenceId) {
  try {
    const response = await axios.get(`${API_URL}/api/Competences/getbyid?=${competenceId}`, {
      headers: { Authorization: `Bearer ${user.token}` },
    });

    return response.data;

  } catch (error) {
    if (error.response && error.response.status === 404) { 
      console.warn("Yetkinlik bilgileri bulunamadı (404).");
      return [];
    } else {
      console.error("Yetkinlikler alınırken bir hata oluştu:", error);
      return [];
    }
  }
}