import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export async function getAllCities(user) {
  try {
    const response = await axios.get(`${API_URL}/api/Cities/getall`, {
      headers: { Authorization: `Bearer ${user.token}` },
    });

    if (response.data) {
      return response.data.map((city) => ({
        value: city.id,
        label: city.name,
      }));
    }
  } catch (error) {
    if (error.response.status === 404) {
      console.warn("Şehir bilgileri bulunamadı.");
      return [];
    } else {
      console.error("Bir hata oluştu:", error);
    }
    return null;
  }
}

export async function getCityInfo(user, cityId) {
  try {
    const response = await axios.get(
      `${API_URL}/api/JobPostings/Cities?id=${cityId}`,
      {
        headers: { Authorization: `Bearer ${user.token}` },
      }
    );

    if (response.data) {
      return response.data((city) => ({
        value: city.id,
        label: city.name
      }))
    }
  } catch (error) {
    if (error.response.status === 404) {
      console.warn("İş ilanı bilgileri bulunamadı.");
      return "";
    } else {
      console.error("Bir hata oluştu:", error);
      return "";
    }
  }
}