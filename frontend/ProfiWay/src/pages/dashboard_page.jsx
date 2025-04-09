import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import { getUserInfo, updateUserInfo } from "../services/UserService";
import { addCompanyInfo, getCompanyInfo, updateCompanyInfo } from "../services/CompanyService";
import { deleteJobPosting, getJobPostingsInfo } from "../services/JobPostingService";
import { getAllCompetences } from "../services/CompetenceService";
import { addResume, getResumeInfo, updateResume } from "../services/ResumeService";
import UserProfile from "../components/dashboard/UserProfile";
import CVForm from "../components/dashboard/ResumeForm";
import CompanySection from "../components/dashboard/CompanySection";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [userInfoData, setUserInfoData] = useState({
    fullName: "",
    userName: "",
    email: "",
    phoneNumber: "",
    createdTime: "",
  });

  const [cvFormData, setCvFormData] = useState({
    title: "",
    summary: "",
    experience: "",
    education: "",
    cvFile: null,
  });

  const [competences, setCompetences] = useState([]);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [selectedCompetences, setSelectedCompetences] = useState([]);
  const [resume, setResume] = useState(null);
  const [info, setInfo] = useState(null);
  const [jobPostingsData, setJobPostingsData] = useState([]);
  const [companyInfoData, setCompanyInfoData] = useState({
    name: "",
    industry: "",
    description: "",
    companyId: ""
  });

  const [isCompUpdateModalOpen, setIsCompUpdateModalOpen] = useState(false);
  const [isCompAddModalOpen, setIsCompAddModalOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    async function fetchUserInfo() {
      if (user) {
        const data = await getUserInfo(user);
        setUserInfoData(data);
      }
    }
    fetchUserInfo();

    if (!user || user?.role != "JobSeeker") {
      async function fetchCompanyInfo() {
        const data = await getCompanyInfo(user);
        setCompanyInfoData(data);
      }
      fetchCompanyInfo();
    }

    async function fetchResumeInfo() {
      const data = await getResumeInfo(user);
      if (user) {
        setResume(data);
        setCvFormData({
          resumeId: data.id,
          title: data.title || "",
          summary: data.summary || "",
          experience: data.experience || "",
          education: data.education || "",
          cvFile: null,
          competences: data.resumeCompetences || [],
        });

        setSelectedCompetences(
          data.resumeCompetences.map((comp) => ({
            value: comp.id,
            label: comp.competenceName,
          }))
        );
      } else {
        console.warn("Özgeçmiş verisi bulunamadı.");
      }
    }

    async function getAllCompetencesInfo() {
      const data = await getAllCompetences(user);
      setCompetences(data);
    }
    getAllCompetencesInfo();

    if (user?.role === "JobSeeker") {
      fetchResumeInfo()
    }
  }, [user, navigate]);

  useEffect(() => {
    async function fetchJobPostingsInfo() {
      if (companyInfoData?.companyId) {
        const data = await getJobPostingsInfo(user, companyInfoData.companyId);
        setJobPostingsData(data);
      }
    }

    if (user?.role === "Company" || user?.role === "Admin") {
      fetchJobPostingsInfo()
    }
  }, [companyInfoData?.companyId, user, navigate]);

  const handleChange = (e) => {
    setCvFormData({
      ...cvFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUserInfoChange = (e) => {
    setUserInfoData({
      ...userInfoData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    setCvFormData({
      ...cvFormData,
      cvFile: e.target.files[0],
    });
  };

  const handleCompanyInfoChange = (e) => {
    setCompanyInfoData({
      ...companyInfoData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCompetenceChange = (selectedOptions) => {
    setSelectedCompetences(selectedOptions);
  };

  const handleUserInfoSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedUser = await updateUserInfo(user, userInfoData);
      setInfo(updatedUser.data);
      setIsUserModalOpen(false);
      alert("User Info başarıyla güncellendi");
    } catch (error) {
      console.error("User güncelleme hatası:", error);
    }
  };

  const handleCompInfoSubmit = async (e) => {
    e.preventDefault();
    try {
      if (companyInfoData.companyId) {
        const updatedCompany = await updateCompanyInfo(user, companyInfoData);
        setIsCompUpdateModalOpen(false);
        alert("Firma başarıyla güncellendi");
      } else {
        const userId = user.id;
        const newCompany = await addCompanyInfo(user, userId, companyInfoData);
        setCompanyInfoData(newCompany.data)
        setIsCompAddModalOpen(false);
        alert("Şirket başarıyla eklendi");
      }
    } catch (error) {
      console.error("Firma işlemi hatası:", error);
    }
  };

  const handleCVSubmit = async (e) => {
    e.preventDefault();
    try {
      if (cvFormData.resumeId) {
        const updatedResume = await updateResume(
          user,
          cvFormData,
          selectedCompetences
        );
        setResume(updatedResume.data);
        alert("CV başarıyla güncellendi");
      } else {
        const newResume = await addResume(
          user,
          cvFormData,
          selectedCompetences
        );
        setResume(newResume.data);
        alert("CV başarıyla eklendi");
      }
    } catch (error) {
      console.error("CV işlemi hatası:", error);
    }
  };

  const handleDeleteClick = async (jobId) => {
    if (window.confirm("Bu iş ilanını silmek istediğinizden emin misiniz?")) {
      try {
        const success = await deleteJobPosting(user, jobId);
        if (success) {
          setJobPostingsData((prevData) => prevData.filter((job) => job.id !== jobId));
          alert("İş ilanı başarıyla silindi.");
        }
      } catch (error) {
        console.error("Silme işlemi hatası:", error);
        alert("İş ilanı silinirken bir hata oluştu.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <UserProfile
            userInfoData={userInfoData}
            user={user}
            isUserModalOpen={isUserModalOpen}
            setIsUserModalOpen={setIsUserModalOpen}
            handleUserInfoChange={handleUserInfoChange}
            handleUserInfoSubmit={handleUserInfoSubmit}
            navigate={navigate}
          />

          <div className="lg:col-span-2">
            {user?.role === "JobSeeker" ? (
              <CVForm
                resume={resume}
                cvFormData={cvFormData}
                handleChange={handleChange}
                handleFileChange={handleFileChange}
                handleCVSubmit={handleCVSubmit}
                competences={competences}
                selectedCompetences={selectedCompetences}
                handleCompetenceChange={handleCompetenceChange}
              />
            ) : (
              <CompanySection
                companyInfoData={companyInfoData}
                jobPostingsData={jobPostingsData}
                isCompUpdateModalOpen={isCompUpdateModalOpen}
                isCompAddModalOpen={isCompAddModalOpen}
                setIsCompUpdateModalOpen={setIsCompUpdateModalOpen}
                setIsCompAddModalOpen={setIsCompAddModalOpen}
                setCompanyInfoData={setCompanyInfoData}
                handleCompanyInfoChange={handleCompanyInfoChange}
                handleCompInfoSubmit={handleCompInfoSubmit}
                handleDeleteClick={handleDeleteClick}
                navigate={navigate}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}