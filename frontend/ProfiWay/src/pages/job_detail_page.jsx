import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getJobPostingInfo } from "../services/JobPostingService";
import { getAllCities } from "../services/CityService";
import { getAllCompanies } from "../services/CompanyService";
import { getAllCompetences } from "../services/CompetenceService";
import { applyToJob } from "../services/ApplicationService";
import Navbar from "../components/Navbar";
import { Building2, MapPin, Calendar, CheckCircle2, XCircle, Briefcase, GraduationCap, Clock, FileText } from 'lucide-react';

export default function JobDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [cities, setCities] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [competences, setCompetences] = useState([]);
  const [hasApplied, setHasApplied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobData, citiesData, compData, companiesData] = await Promise.all([
          getJobPostingInfo(user, id),
          getAllCities(user),
          getAllCompetences(user),
          getAllCompanies(user),
        ]);

        setJob(jobData);
        setCities(citiesData);
        setCompanies(companiesData);
        setCompetences(compData);

        console.log(jobData); // Burada job.jobPostingCompetences'ı kontrol edin

        
        const appliedIds = jobData.applications.map((a) => a.id);
        setHasApplied(appliedIds.length > 0);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id, user]);

  const getCompanyName = (companyId) => {
    const company = companies.find((c) => c.id === companyId);
    return company?.name || "Bilinmeyen Şirket";
  };

  const handleApply = async () => {
    try {
      await applyToJob(user, id);
      setHasApplied(true);
      
      // Show success message with animation
      const successMessage = document.getElementById('successMessage');
      successMessage.classList.remove('hidden');
      successMessage.classList.add('slide-in');
      
      setTimeout(() => {
        successMessage.classList.add('hidden');
      }, 3000);
    } catch (err) {
      // Show error message with animation
      const errorMessage = document.getElementById('errorMessage');
      errorMessage.classList.remove('hidden');
      errorMessage.classList.add('slide-in');
      
      setTimeout(() => {
        errorMessage.classList.add('hidden');
      }, 3000);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800">İlan bulunamadı</h2>
          <p className="text-gray-600 mt-2">Bu iş ilanı mevcut değil veya kaldırılmış olabilir.</p>
        </div>
      </div>
    );
  }

  const canApply = user && (user.role.includes("JobSeeker") || user.role.includes("Admin")) && !hasApplied;
  const cityName = cities.find((c) => c.value === job.cityId)?.label || "Bilinmeyen Şehir";
  const companyName = getCompanyName(job.companyId);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Success Message */}
      <div id="successMessage" className="hidden fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
        <div className="flex items-center space-x-2">
          <CheckCircle2 className="h-5 w-5" />
          <span>Başvurunuz başarıyla alındı!</span>
        </div>
      </div>

      {/* Error Message */}
      <div id="errorMessage" className="hidden fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
        <div className="flex items-center space-x-2">
          <XCircle className="h-5 w-5" />
          <span>Başvuru sırasında bir hata oluştu.</span>
        </div>
      </div>
      

      <div className="container mx-auto pt-24 px-4 pb-12">
        <div className="max-w-4xl mx-auto">
          {/* Job Header */}
          <div className="bg-white rounded-t-xl shadow-sm p-8 border-b">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-3">{job.title}</h1>
                <div className="flex items-center space-x-4 text-gray-600">
                  <span className="flex items-center">
                    <Building2 className="h-5 w-5 mr-2 text-gray-400" />
                    {companyName}
                  </span>
                  <span className="flex items-center">
                    <MapPin className="h-5 w-5 mr-2 text-gray-400" />
                    {cityName}
                  </span>
                  <span className="flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-gray-400" />
                    Yeni
                  </span>
                </div>
              </div>
              {user && (
                <div className="flex flex-col items-end">
                  {canApply ? (
                    <button
                      onClick={handleApply}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center"
                    >
                      <Briefcase className="h-5 w-5 mr-2" />
                      Hemen Başvur
                    </button>
                  ) : hasApplied ? (
                    <div className="flex items-center text-green-600">
                      <CheckCircle2 className="h-5 w-5 mr-2" />
                      Başvurunuz Alındı
                    </div>
                  ) : (
                    <div className="flex items-center text-gray-500">
                      <XCircle className="h-5 w-5 mr-2" />
                      Başvuru Kapalı
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Job Content */}
          <div className="bg-white rounded-b-xl shadow-sm p-8">
            {/* Required Skills */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <GraduationCap className="h-6 w-6 mr-2 text-blue-600" />
                Aranan Yetenekler
              </h2>
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

            {/* Job Description */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <FileText className="h-6 w-6 mr-2 text-blue-600" />
                İş Tanımı
              </h2>
              <div className="prose max-w-none text-gray-600">
                {job.description.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-4">{paragraph}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}