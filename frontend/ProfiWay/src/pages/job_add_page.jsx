import React, { useState, useEffect } from "react";
import { Building2, MapPin, Briefcase, FileText, Plus, X } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import { getCompanyInfo } from "../services/CompanyService";
import { getAllCities } from "../services/CityService";
import { getAllCompetences } from "../services/CompetenceService";
import Select from "react-select";
import { addJobPosting } from "../services/JobPostingService";


const JobPostingForm = () => {
  const { user } = useAuth();

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
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    companyId: "",
    cityId: "",
    competenceIds: [],
  });

  useEffect(() => {
    async function fetchCompanyInfo() {
      const data = await getCompanyInfo(user);
      setCompanyInfoData(data);
      setFormData(prev => ({
        ...prev,
        companyId: data?.companyId || ""
      }));
    }
    fetchCompanyInfo();

    // GETALL CITIES
    async function fetchAllCities() {
      const data = await getAllCities(user);
      setCitiesData(data);
    }
    fetchAllCities();

    // GETALL COMPETENCES
    async function getAllCompetencesInfo() {
      const data = await getAllCompetences(user);
      setCompetences(data);
    }
    getAllCompetencesInfo();
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
    //e.preventDefault();
    const newErrors = validateForm();
  
    if (Object.keys(newErrors).length === 0) {
      try {
        const jobData = {
          title: formData.title,
          description: formData.description,
          companyId: Number(companyInfoData.companyId),
          cityId: Number(formData.cityId),
          competenceIds: selectedCompetences.map((comp) => Number(comp.value)),
        };
  
        await addJobPosting(user, jobData);
  
        alert("İş ilanı başarıyla eklendi!");
        //navigate("/dashboard"); // İş ilanları listesine yönlendirme
  
        // Form sıfırlama
        setFormData({
          title: "",
          description: "",
          companyId: "",
          cityId: "",
          competenceIds: [],
        });
        setSelectedCompetences([]);
        console.log(formData);

        setTimeout(() => {
          navigate("/dashboard", { replace: true });
        }, 2);
      } catch (error) {
        alert("İş ilanı eklenirken bir hata oluştu.");
      }
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <Navbar/>
      <div className="container mx-auto pt-20 px-6 gap-6">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">
              Yeni İş İlanı Oluştur
            </h1>
            <p className="mt-2 text-gray-600">
              Yeni mezunlar için bir iş ilanı oluşturun.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* İlan Başlığı */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                İlan Başlığı
              </label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className={`pl-10 w-full h-11 rounded-lg border ${
                    errors.title ? "border-red-300" : "border-gray-300"
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder="Örn: Junior Frontend Developer"
                />
              </div>
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
              )}
            </div>

            {/* Şehir Seçimi */}
            <div>
              <label
                htmlFor="id"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Şehir
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <select
                  id="cityId"
                  name="cityId"
                  value={formData.cityId}
                  onChange={handleInputChange}
                  className={`pl-10 w-full h-11 rounded-lg border ${
                    errors.cityId ? "border-red-300" : "border-gray-300"
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                >
                  <option value="">Şehir Seçin</option>
                  {citiesData.map((city) => (
                    <option key={city.value} value={city.value}>
                      {city.label}
                    </option>
                  ))}
                </select>
              </div>
              {errors.cityId && (
                <p className="mt-1 text-sm text-red-600">{errors.cityId}</p>
              )}
            </div>

            {/* İlan Açıklaması */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                İlan Açıklaması
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className={`pl-10 w-full rounded-lg border ${
                    errors.description ? "border-red-300" : "border-gray-300"
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder="İş tanımı, gereksinimler ve beklentiler..."
                />
              </div>
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.description}
                </p>
              )}
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
              {console.log("Select İçindeki Competences:", competences)}
            </div>

            {/* Submit Button */}
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

export default JobPostingForm;