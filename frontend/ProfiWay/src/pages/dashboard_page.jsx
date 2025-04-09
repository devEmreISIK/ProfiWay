import React, { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Select from "react-select";
import { getUserInfo, updateUserInfo } from "../services/UserService";
import { addCompanyInfo, getCompanyInfo, updateCompanyInfo } from "../services/CompanyService";
import { deleteJobPosting, getJobPostingsInfo } from "../services/JobPostingService";
import { getAllCompetences } from "../services/CompetenceService";
import { addResume, getResumeInfo, updateResume } from "../services/ResumeService";
import { InfoItem } from "../components/InfoItem";
import FormDialog from "../components/FormDialog";
import { User, Briefcase, Building2, GraduationCap, Edit3, Trash2, Plus, FileText, ExternalLink } from 'lucide-react';

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
          {/* Profile Section */}
          <div className="bg-white rounded-xl shadow-sm p-6 lg:col-span-1">
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                  <User className="w-16 h-16 text-white" />
                </div>
                <div className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-2 cursor-pointer hover:bg-blue-700 transition-colors">
                  <Edit3 className="w-5 h-5 text-white" />
                </div>
              </div>

              <h2 className="mt-4 text-2xl font-bold text-gray-900">{userInfoData?.fullName}</h2>
              <p className="text-gray-600">{userInfoData?.email}</p>

              <div className="mt-6 w-full grid grid-cols-1 gap-4">
                <button
                  onClick={() => setIsUserModalOpen(true)}
                  className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  Profili Düzenle
                </button>

                {user?.role === "JobSeeker" && (
                  <button
                    onClick={() => navigate(`/myapplications`)}
                    className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Briefcase className="w-4 h-4 mr-2" />
                    Başvurularım
                  </button>
                )}
              </div>

              <div className="mt-8 w-full space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">
                    Hesap Bilgileri
                  </h3>
                  <InfoItem label="Kullanıcı Adı" value={userInfoData?.userName} />
                  <InfoItem label="Rol" value={user?.role === "JobSeeker" ? "İş Arayan" : "İşveren"} />
                  <InfoItem label="Kayıt Tarihi" value={userInfoData?.createdTime} />
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">
                    İletişim Bilgileri
                  </h3>
                  <InfoItem label="Email" value={userInfoData?.email} />
                  <InfoItem label="Telefon" value={userInfoData?.phoneNumber || "-"} />
                </div>
              </div>
            </div>

            {isUserModalOpen && (
              <FormDialog
                open={isUserModalOpen}
                onClose={() => setIsUserModalOpen(false)}
                title="Profili Düzenle"
                fields={[
                  { name: "fullName", label: "Tam Ad" },
                  { name: "userName", label: "Kullanıcı Adı" },
                  { name: "email", label: "Email", type: "email" },
                  { name: "phoneNumber", label: "Telefon Numarası" },
                ]}
                formData={userInfoData}
                onChange={handleUserInfoChange}
                onSubmit={handleUserInfoSubmit}
              />
            )}
          </div>

          {/* Main Content Section */}
          <div className="lg:col-span-2">
            {user?.role === "JobSeeker" ? (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {resume ? "CV Güncelle" : "CV Oluştur"}
                  </h2>
                  <FileText className="w-6 h-6 text-gray-400" />
                </div>

                <form onSubmit={handleCVSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Başlık</label>
                    <input
                      type="text"
                      name="title"
                      value={cvFormData.title}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="CV başlığınızı girin"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Özet</label>
                    <textarea
                      name="summary"
                      value={cvFormData.summary}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows="4"
                      placeholder="Kendinizi kısaca tanıtın"
                    ></textarea>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Deneyim</label>
                    <textarea
                      name="experience"
                      value={cvFormData.experience}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows="4"
                      placeholder="İş deneyimlerinizi yazın"
                    ></textarea>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Eğitim</label>
                    <textarea
                      name="education"
                      value={cvFormData.education}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows="4"
                      placeholder="Eğitim bilgilerinizi yazın"
                    ></textarea>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Yetkinlikler</label>
                    <Select
                      options={competences}
                      value={selectedCompetences}
                      isMulti
                      onChange={handleCompetenceChange}
                      className="w-full"
                      classNamePrefix="select"
                      placeholder="Yetkinliklerinizi seçin"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">CV Dosyası</label>
                    <input
                      type="file"
                      name="cvFile"
                      onChange={handleFileChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                  >
                    <GraduationCap className="w-5 h-5 mr-2" />
                    CV'yi Kaydet
                  </button>
                </form>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Company Info Section */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Firma Bilgileri</h2>
                    <Building2 className="w-6 h-6 text-gray-400" />
                  </div>

                  {companyInfoData ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-sm text-gray-500">Firma Adı</p>
                          <p className="text-lg font-medium">{companyInfoData.name}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-sm text-gray-500">Endüstri</p>
                          <p className="text-lg font-medium">{companyInfoData.industry}</p>
                        </div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">Açıklama</p>
                        <p className="text-lg font-medium">{companyInfoData.description || "Açıklama eklenmemiş"}</p>
                      </div>
                      <button
                        className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                        onClick={() => setIsCompUpdateModalOpen(true)}
                      >
                        <Edit3 className="w-5 h-5 mr-2" />
                        Firma Bilgilerini Güncelle
                      </button>
                    </div>
                  ) : (
                    <button
                      className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                      onClick={() => {
                        setCompanyInfoData({
                          name: "",
                          industry: "",
                          description: "",
                        });
                        setIsCompAddModalOpen(true);
                      }}
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      Firma Bilgilerini Ekle
                    </button>
                  )}
                </div>

                {/* Job Postings Section */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">İlanlarınız</h2>
                    <Briefcase className="w-6 h-6 text-gray-400" />
                  </div>

                  {jobPostingsData.length > 0 ? (
                    <div className="space-y-4">
                      {jobPostingsData.map((job) => (
                        <div key={job.id} className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => navigate(`/job-applications/${job.id}`)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Başvuruları Görüntüle"
                              >
                                <ExternalLink className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => navigate(`/updatejobposting/${job.id}`)}
                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                title="Güncelle"
                              >
                                <Edit3 className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => handleDeleteClick(job.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Sil"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">Henüz iş ilanı bulunmamaktadır.</p>
                    </div>
                  )}

                  <button
                    onClick={() => navigate("/addjobposting")}
                    className="mt-6 w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Yeni İş İlanı Ekle
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {isCompUpdateModalOpen && (
        <FormDialog
          open={isCompUpdateModalOpen}
          onClose={() => setIsCompUpdateModalOpen(false)}
          title="Firma Bilgilerini Güncelle"
          fields={[
            { name: "name", label: "Firma Adı" },
            { name: "industry", label: "Endüstri" },
            { name: "description", label: "Açıklama" },
          ]}
          formData={companyInfoData}
          onChange={handleCompanyInfoChange}
          onSubmit={handleCompInfoSubmit}
        />
      )}

      {isCompAddModalOpen && (
        <FormDialog
          open={isCompAddModalOpen}
          onClose={() => setIsCompAddModalOpen(false)}
          title="Firma Bilgilerini Ekle"
          fields={[
            { name: "name", label: "Firma Adı" },
            { name: "industry", label: "Endüstri" },
            { name: "description", label: "Açıklama" },
          ]}
          formData={companyInfoData}
          onChange={handleCompanyInfoChange}
          onSubmit={handleCompInfoSubmit}
        />
      )}
    </div>
  );
}