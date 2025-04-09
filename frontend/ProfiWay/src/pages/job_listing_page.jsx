import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Building2, MapPin, Briefcase } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import { getFilteredJobPostings } from "../services/JobPostingService";
import { getAllCities } from "../services/CityService";
import { getAllCompetences } from "../services/CompetenceService";
import { getAllCompanies } from "../services/CompanyService";

export default function JobListings() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState({
    jobs: [],
    totalCount: 0,
  });
  const [filters, setFilters] = useState({
    search: "",
    location: "",
    skill: "",
    page: 0,
    size: 5,
  });
  const [cities, setCities] = useState([]);
  const [competences, setCompetences] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      try {
        const [citiesRes, compRes, companiesRes] = await Promise.all([
          getAllCities(user),
          getAllCompetences(user),
          getAllCompanies(user),
        ]);
        setCities(citiesRes);
        setCompetences(compRes);
        setCompanies(companiesRes);
      } finally {
        setIsLoading(false);
      }
    };
    loadInitialData();
  }, [user]);

  useEffect(() => {
  const loadJobs = async () => {
    setIsLoading(true);
    try {
      const result = await getFilteredJobPostings(user, filters);

      setData({
        jobs: result.items || [], 
        totalCount: result.totalCount || 0, 
      });

      console.log("data: ",data)

    } catch (error) { 
       console.error("İlanlar yüklenirken hata:", error);
       setData({ jobs: [], totalCount: 0 }); 
    } finally {
      setIsLoading(false);
    }
  };
  
  if (user) {
     loadJobs();
  }
}, [filters, user]); 

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 0 }));
  };

  const getCompanyName = (companyId) => {
    const company = companies.find(
      (c) => c.id === companyId || c.value === companyId
    );
    return company?.name || company?.label || "Bilinmeyen Şirket";
  };

  const totalPages = Math.ceil(data.totalCount / filters.size);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto pt-20 px-45 pb-15">
        {/* Filtreleme Alanı */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="İş ara..."
                className="pl-10 w-full h-11 rounded-lg border border-gray-300"
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
              />
            </div>

            <div className="relative">
              <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              <select
                className="pl-10 w-full h-11 rounded-lg border border-gray-300"
                value={filters.location}
                onChange={(e) => handleFilterChange("location", e.target.value)}
              >
                <option value="">Tüm Şehirler</option>
                {cities.map((city) => (
                  <option key={city.value} value={city.value}>
                    {city.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative">
              <Briefcase className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              <select
                className="pl-10 w-full h-11 rounded-lg border border-gray-300"
                value={filters.skill}
                onChange={(e) => handleFilterChange("skill", e.target.value)}
              >
                <option value="">Tüm Yetenekler</option>
                {competences.map((skill) => (
                  <option key={skill.value} value={skill.value}>
                    {skill.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Yükleniyor Durumu */}
        {isLoading && (
          <div className="text-center py-8 text-gray-500">Yükleniyor...</div>
        )}

        {/* İlan Listesi */}
        {!isLoading && (
          <>
            <div className="space-y-4">
              {data.jobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => navigate(`/jobs/${job.id}`)}
                >
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    {job.title}
                  </h2>

                  <div className="flex flex-wrap gap-4 text-gray-600 mb-4">
                    <div className="flex items-center">
                      <Building2 className="h-4 w-4 mr-2" />
                      {getCompanyName(job.companyId)}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      {cities.find((c) => c.value === job.cityId)?.label ||
                        "Bilinmeyen Şehir"}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {job.jobPostingCompetences.map((skillObj) => {
                      const skill = competences.find(
                        (c) => c.id === skillObj.id
                      );
                      return (
                        <span
                          key={skillObj.id}
                          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                        >
                          {skill?.name || "Bilinmeyen Yetenek"}
                        </span>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Sayfalama */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center gap-2 flex-wrap">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setFilters((prev) => ({ ...prev, page: i }))}
                    className={`px-4 py-2 rounded-lg ${
                      filters.page === i
                        ? "bg-blue-600 text-white"
                        : "bg-white border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
