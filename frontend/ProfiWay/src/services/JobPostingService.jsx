import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export async function getJobPostingsInfo(user, compId) {
  try {
    const response = await axios.get(
      `${API_URL}/api/JobPostings/getbycompanyid?companyId=${compId}`,
      {
        headers: { Authorization: `Bearer ${user.token}` },
      }
    );

    if (response.data && Array.isArray(response.data)) {
      return response.data.map((job) => ({
        id: job.id || "",
        title: job.title || "",
        description: job.description || "",
        companyId: job.companyId || "",
        cityId: job.cityId || "",
        jobPostingCompetences: job.jobPostingCompetences.$values || [],
        //applications: job.applications || [], // Varsayılan olarak boş dizi verelim
      }));
    }
  } catch (error) {
    if (error.response.status === 404) {
      console.warn("İş ilanı bilgileri bulunamadı.");
      return [];
    } else {
      console.error("Bir hata oluştu:", error);
      return [];
    }
  }
}

export async function getJobPostingInfo(user, jobId) {
  try {
    const response = await axios.get(
      `${API_URL}/api/JobPostings/getbyid?id=${jobId}`,
      {
        headers: { Authorization: `Bearer ${user.token}` },
      }
    );

    if (response.data) {
      return {
        id: response.data.id || "",
        title: response.data.title || "",
        description: response.data.description || "",
        companyId: response.data.companyId || "",
        cityId: response.data.cityId || "",
        jobPostingCompetences: response.data.jobPostingCompetences.$values || [],
        //applications: job.applications || [], // Varsayılan olarak boş dizi verelim
      };
    }
  } catch (error) {
    if (error.response.status === 404) {
      console.warn("İş ilanı bilgileri bulunamadı.");
      return [];
    } else {
      console.error("Bir hata oluştu:", error);
      return [];
    }
  }
}


export async function addJobPosting(user, jobData) {
  try {
    const response = await axios.post(
      `${API_URL}/api/JobPostings/add`,
      jobData,
      {
        headers: { Authorization: `Bearer ${user.token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error("İş ilanı eklenirken hata oluştu:", error);
    throw error;
  }
}


export async function updateJobPosting(user, jobPosting) {
  try {
    const response = await axios.put(
      `${API_URL}/api/JobPostings/update`,
      {
        id: jobPosting.id,
        title: jobPosting.title,
        description: jobPosting.description,
        companyId: jobPosting.companyId,
        cityId: jobPosting.cityId,
        competenceIds: jobPosting.competenceIds || [], // Eğer boş olabilir diyorsan
      },
      {
        headers: { Authorization: `Bearer ${user.token}` },
      }
    );

    return response.data;
  } catch (error) {
    console.error("İş ilanı güncelleme hatası:", error);
    throw error;
  }
}


export async function deleteJobPosting(user, jobId) {
  try {
    const response = await axios.delete(`${API_URL}/api/JobPostings/delete`, {
      headers: { Authorization: `Bearer ${user.token}` },
      data: { id: jobId }, // API'nin beklediği format
    });

    return response.status === 200;
  } catch (error) {
    console.error("İş ilanı silme hatası:", error);
    throw error;
  }
}


export async function getAllJobPostings(user) {
  try {
      const response = await axios.get(
          `${API_URL}/api/JobPostings/getall`,
          {
              headers: { Authorization: `Bearer ${user.token}` },
          }
      );
      return response.data;
  } catch (error) {
      console.error("İş ilanları çekilirken hata oluştu:", error);
      throw error;
  }
}

export async function getFilteredJobPostings(user, filters) {
  try {
    const params = {
      index: filters.page,
      size: filters.size,
      search: filters.search,
      location: filters.location,
      skill: filters.skill,
    };

    const response = await axios.get(`${API_URL}/api/JobPostings/getall`, {
      headers: { Authorization: `Bearer ${user.token}` },
      params
    });

    return {
      items: response.data,
      totalCount: response.headers['x-total-count'] 
    };
  } catch (error) {
    console.error("Filtrelenmiş ilanlar alınamadı:", error);
    throw error;
  }
}