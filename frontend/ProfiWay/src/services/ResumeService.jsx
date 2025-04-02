import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export async function getResumeInfo(user) {
  try {
    const response = await axios.get(
      `${API_URL}/api/Resumes/getbyid?id=${user.id}`,
      {
        headers: { Authorization: `Bearer ${user.token}` },
      }
    );

    if (response.data && response.data.id) {
      return response.data;
    }
  } catch (error) {
    if (error.response.status === 404) {
      console.warn("CV bilgileri bulunamadı.");
      return "";
    } else {
      console.error("Bir hata oluştu:", error);
    }
    return null;
  }
}

export async function addResume(user, cvFormData, selectedCompetences) {
  const jsonData = {
    UserId: user.id,
    Title: cvFormData.title,
    Summary: cvFormData.summary,
    Experience: cvFormData.experience,
    Education: cvFormData.education,
    CvFilePath: cvFormData.cvFile ? "uploaded_file_path" : "string",
    CompetenceIds: selectedCompetences.map((c) => c.value),
  };

  try {
    const response = await axios.post(
      `${API_URL}/api/Resumes/add`,
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
      "CV Ekleme Hatası:",
      err.response ? err.response.data : err.message
    );
    throw err;
  }
}

export async function updateResume(user, cvFormData, selectedCompetences) {
  const jsonDataToUpdate = {
    Id: cvFormData.resumeId,
    Title: cvFormData.title,
    Summary: cvFormData.summary,
    Experience: cvFormData.experience,
    Education: cvFormData.education,
    CvFilePath: cvFormData.cvFile ? "uploaded_file_path" : "string",
    CompetenceIds: selectedCompetences.map((c) => c.value),
  };

  try {
    const response = await axios.put(
      `${API_URL}/api/Resumes/update`,
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
      "CV Güncelleme Hatası:",
      err.response ? err.response.data : err.message
    );
    throw err;
  }
}
