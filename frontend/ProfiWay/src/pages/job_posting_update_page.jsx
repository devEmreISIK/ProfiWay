import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getJobPostingInfo, updateJobPosting } from "../services/JobPostingService";
import { getAllCities } from "../services/CityService";
import { getAllCompetences } from "../services/CompetenceService";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import LoadingSpinner from "../components/LoadingSpinner";
import JobPostingFormFields from "../components/JobPostingFormFields";

const JobPostingUpdate = () => {
  const { user } = useAuth();
  const { jobPostingId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    cityId: "",
    companyId: "",
    competenceIds: []
  });

  const [citiesData, setCitiesData] = useState([]);
  const [competences, setCompetences] = useState([]);
  const [selectedCompetences, setSelectedCompetences] = useState([]);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [competencesData, jobData, citiesData] = await Promise.all([
          getAllCompetences(user),
          getJobPostingInfo(user, Number(jobPostingId)),
          getAllCities(user)
        ]);

        setCompetences(competencesData);
        setCitiesData(citiesData);

        const selectedCompetencesMapped = jobData.jobPostingCompetences.map((c) => {
          const found = competencesData.find(comp => comp.value === c.id);
          return found ? { value: found.value, label: found.label } : null;
        }).filter(Boolean);

        setFormData({
          title: jobData.title,
          description: jobData.description,
          cityId: String(jobData.cityId ?? ''),
          companyId: jobData.companyId,
          competenceIds: selectedCompetencesMapped.map(c => c.value)
        });

        setSelectedCompetences(selectedCompetencesMapped);
      } catch (error) {
        console.error("Veriler alınırken hata:", error);
      }
    };

    fetchData();
  }, [user, jobPostingId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCompetenceChange = (selectedOptions) => {
    setSelectedCompetences(selectedOptions);
    setFormData((prev) => ({
      ...prev,
      competenceIds: selectedOptions.map((comp) => comp.value),
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "İlan başlığı gereklidir";
    if (!formData.description.trim()) newErrors.description = "İlan açıklaması gereklidir";
    if (!formData.cityId) newErrors.cityId = "Şehir seçimi gereklidir";
    if (formData.competenceIds.length === 0) newErrors.competenceIds = "En az bir yetenek seçilmelidir";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);
      try {
        const jobData = {
          id: jobPostingId,
          title: formData.title,
          description: formData.description,
          cityId: Number(formData.cityId),
          competenceIds: selectedCompetences.map((comp) => Number(comp.value)),
        };

        await updateJobPosting(user, jobData);
        setTimeout(() => {
          alert("İş ilanı başarıyla güncellendi!");
          navigate("/dashboard");
        }, 1500);
      } catch (error) {
        setIsLoading(false);
        alert("İş ilanı güncellenirken bir hata oluştu.");
      }
    } else {
      setErrors(newErrors);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <Navbar />
      <div className="container mx-auto pt-20 px-45 pb-15">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">İş İlanını Güncelle</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
              <JobPostingFormFields
                formData={formData}
                citiesData={citiesData}
                competences={competences}
                selectedCompetences={selectedCompetences}
                errors={errors}
                handleInputChange={handleInputChange}
                handleCompetenceChange={handleCompetenceChange}
              />

              <div className="pt-4 flex justify-between gap-5">
                <button
                  type="button"
                  onClick={handleGoBack}
                  className="w-full bg-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-400 transition-colors focus:outline-none"
                >
                  Geri Git
                </button>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  İlanı Güncelle
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobPostingUpdate;