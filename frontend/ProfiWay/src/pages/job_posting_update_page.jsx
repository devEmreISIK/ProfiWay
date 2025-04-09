import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getJobPostingInfo, updateJobPosting } from "../services/JobPostingService";
import { getAllCities, getCityInfo } from "../services/CityService";
import { getAllCompetences } from "../services/CompetenceService";
import Select from "react-select";
import { useAuth } from "../context/AuthContext";
import { Briefcase, MapPin, FileText } from "lucide-react";
import Navbar from "../components/Navbar";
import LoadingSpinner from "../components/LoadingSpinner";

const JobPostingUpdatePage = () => {
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
  const [cityData, setCityData] = useState({});
  const [competences, setCompetences] = useState([]);
  const [selectedCompetences, setSelectedCompetences] = useState([]);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const competencesData = await getAllCompetences(user);  
        setCompetences(competencesData);
  
        const jobData = await getJobPostingInfo(user, Number(jobPostingId));
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
  
        const cities = await getAllCities(user);  
        setCitiesData(cities);
      } catch (error) {
        console.error("Veriler alınırken hata:", error);
      }
    };
  
    fetchData();
  }, [user, jobPostingId]);

  

  useEffect(() => {
    console.log("Formdata: ", formData)
    console.log();
  }, [cityData]);

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
    e.preventDefault(); // form reload olmasın
    const newErrors = validateForm();
  
    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true); // loading başlasın
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
        }, 3250); 
      } catch (error) {
        alert("İş ilanı güncellenirken bir hata oluştu.");
        setIsLoading(false);
      }
    } else {
      setErrors(newErrors);
    }
  };
  

  const handleGoBack = () => {
    navigate(-1); 
  };

  return isLoading ? (
    <LoadingSpinner />
  ) :  (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <Navbar/>
      <div className="container mx-auto pt-20 px-45 pb-15">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">İş İlanını Güncelle</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* İlan Başlığı */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">İlan Başlığı</label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className={`pl-10 w-full h-11 rounded-lg border ${errors.title ? "border-red-300" : "border-gray-300"}`}
                  placeholder="Örn: Junior Frontend Developer"
                />
              </div>
              {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
            </div>

            {/* Şehir Seçimi */}
            <div>
              <label htmlFor="cityId" className="block text-sm font-medium text-gray-700 mb-1">Şehir</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <select
                  id="cityId"
                  name="cityId"
                  value={formData.cityId}
                  onChange={handleInputChange}
                  className={`pl-10 w-full h-11 rounded-lg border ${errors.cityId ? "border-red-300" : "border-gray-300"}`}
                >
                  <option value={cityData.value}>Şehir Seçin</option>
                  {citiesData.map((city) => (
                    <option key={city.value} value={city.value}>
                      {city.label}
                    </option>
                  ))}
                </select>
              </div>
              {errors.cityId && <p className="mt-1 text-sm text-red-600">{errors.cityId}</p>}
            </div>

            {/* İlan Açıklaması */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">İlan Açıklaması</label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className={`pl-10 w-full rounded-lg border ${errors.description ? "border-red-300" : "border-gray-300"}`}
                  placeholder="İş tanımı, gereksinimler ve beklentiler..."
                />
              </div>
              {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
            </div>

            {/* Yetenekler */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Yetkinlikler</label>
              <Select
                options={competences}
                value={selectedCompetences}
                isMulti
                onChange={handleCompetenceChange}
                className="w-full basic-multi-select"
                classNamePrefix="select"
              />
            </div>

            {/* Submit Button */}
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

export default JobPostingUpdatePage;
