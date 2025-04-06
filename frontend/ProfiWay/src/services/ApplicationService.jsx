import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;


export const applyToJob = async (user, jobPostingId) => {
  const response = await axios.post(
    "https://localhost:7198/api/Applications/add",
    {
      userId: user.id,
      jobPostingId: jobPostingId,
    },
    {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    }
  );

  return response.data;
};


export async function getApplicationsByJobPosting(user, jobId) {
  try {
    const response = await axios.get(
      `${API_URL}/api/Applications/getallbyjobpostings?id=${jobId}`,
      { headers: { Authorization: `Bearer ${user.token}` } }
    );
    return response.data;
  } catch (error) {
    console.error("Başvurular alınamadı:", error);
    return [];
  }
}

export async function updateApplicationStatus(user, applicationId, status) {
  try {
    const response = await axios.put(
      `${API_URL}/api/Applications/update`,
      { id: applicationId, status: status },
      { headers: { Authorization: `Bearer ${user.token}` } }
    );
    return response.data;
  } catch (error) {
    console.error("Durum güncellenemedi:", error);
    throw error;
  }
}
