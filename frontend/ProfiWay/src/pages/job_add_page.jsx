import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import { getCompanyInfo } from "../services/CompanyService";
import { getAllCities } from "../services/CityService";
import { getAllCompetences } from "../services/CompetenceService";
import { addJobPosting } from "../services/JobPostingService";
import LoadingSpinner from "../components/LoadingSpinner";
import JobPostingFormFields from "../components/JobPostingFormFields";

const JobPostingAdd = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [competences, setCompetences] = useState([]);
  const [selectedCompetences, setSelectedCompetences] = useState([]);
  const [citiesData, setCitiesData] = useState([]);
  const [companyInfoData, setCompanyInfoData] = useState({
    companyId: "",
    name: "",
    industry: "",
    description: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    companyId: "",
    cityId: "",
    competenceIds: [],
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const [companyData, citiesData, competencesData] = await Promise.all([
          getCompanyInfo(user),
          getAllCities(user),
          getAllCompetences(user)
        ]);

        setCompanyInfoData(companyData);
        setFormData(prev => ({
          ...prev,
          companyId: companyData?.companyId || ""
        }));
        setCitiesData(citiesData);
        setCompetences(competencesData);
      } catch (error) {
        console.error("Veri yükleme hatası:", error);
      }
    }
    fetchData();
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
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
          title: formData.title,
          description: formData.description,
          companyId: Number(companyInfoData.companyId),
          cityId: Number(formData.cityId),
          competenceIds: selectedCompetences.map((comp) => Number(comp.value)),
        };

        await addJobPosting(user, jobData);
        setTimeout(() => {
          alert("İş ilanı başarıyla eklendi!");
          navigate("/dashboard");
        }, 1500);
      } catch (error) {
        setIsLoading(false);
        alert("İş ilanı eklenirken bir hata oluştu.");
      }
    } else {
      setErrors(newErrors);
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <Navbar />
      <div className="container mx-auto pt-20 px-6 gap-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm p-8">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900">Yeni İş İlanı Oluştur</h1>
              <p className="mt-2 text-gray-600">Yeni mezunlar için bir iş ilanı oluşturun.</p>
            </div>

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

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  İlanı Yayınla
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobPostingAdd;