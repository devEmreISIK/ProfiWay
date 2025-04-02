import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export async function getCompanyInfo(user) {
  try {
    const response = await axios.get(
      `${API_URL}/api/Companies/getbyid?id=${user.id}`,
      {
        headers: { Authorization: `Bearer ${user.token}` },
      }
    );

    if (response.data) {
      return {
        companyId: response.data.id || "",
        name: response.data.name || "",
        industry: response.data.industry || "",
        description: response.data.description || "",
      };
    }
  } catch (error) {
    if (error.response && error.response.status === 404) {
      console.warn("Firma bilgileri bulunamadı.");
    } else {
      console.error("Bir hata oluştu:", error);
    }
    return null;
  }
}

export async function updateCompanyInfo(user, companyInfoData) {
  const jsonDataToUpdate = {
    Id: companyInfoData.companyId,
    Name: companyInfoData.name,
    Description: companyInfoData.description,
    Industry: companyInfoData.industry,
  };

  try {
    const response = await axios.put(
      `${API_URL}/api/Companies/update`,
      jsonDataToUpdate,
      {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (err) {
    console.error(
      "Firma Güncelleme Hatası:",
      err.response ? err.response.data : err.message
    );
    throw err;
  }
}

export async function addCompanyInfo(user, companyInfoData) {
  const jsonData = {
    UserId: user.id,
    Name: companyInfoData.name,
    Description: companyInfoData.description,
    Industry: companyInfoData.industry,
  };

  try {
    const response = await axios.post(
      `${API_URL}/api/Companies/add`,
      JSON.stringify(jsonData),
      {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (err) {
    console.error(
      "Firma Ekleme Hatası:",
      err.response ? err.response.data : err.message
    );
    throw err;
  }
}
