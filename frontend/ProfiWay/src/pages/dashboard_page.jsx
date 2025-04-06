import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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


export default function Dashboard() {
  const { user } = useAuth();

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

  const navigate = useNavigate();

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


    // FETCH USER INFO
    async function fetchUserInfo() {
      if (user) {
        const data = await getUserInfo(user);
        setUserInfoData(data);
      }
    }
    fetchUserInfo();

    if (!user || user?.role != "JobSeeker") {
      // FETCH COMPANY INFO
      async function fetchCompanyInfo() {
        const data = await getCompanyInfo(user);
        setCompanyInfoData(data);
      }
      fetchCompanyInfo();
    }

    // FETCH RESUME INFO
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
            label: comp.name,
          }))
        );
      } else {
        console.warn("Özgeçmiş verisi bulunamadı.");
      }
    }
    //fetchResumeInfo();

    // GETALL COMPETENCES
    async function getAllCompetencesInfo() {
      const data = await getAllCompetences(user);
      setCompetences(data);
    }
    getAllCompetencesInfo();


    if (user?.role == "JobSeeker") {
      fetchResumeInfo()
    }
  }, [user, navigate]);

  useEffect(() => {
    // FETCH JOBPOSTING INFO
    async function fetchJobPostingsInfo() {
      const data = await getJobPostingsInfo(user, companyInfoData.companyId);
      console.log("Fetched job postings:", data);
      console.log("Company Id: ", companyInfoData.companyId)
      setJobPostingsData(data);
    }
    //fetchJobPostingsInfo();

    if (user?.role != "JobSeeker") {
      fetchJobPostingsInfo()
    }
  },[companyInfoData?.companyId, navigate]);


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

  // Yetkinlik seçim işlemi
  const handleCompetenceChange = (selectedOptions) => {
    setSelectedCompetences(selectedOptions);
  };

  // USER INFO UPDATE BUTTON HANDLER
  const handleUserInfoSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedUser = await updateUserInfo(user, userInfoData);
      setInfo(updatedUser.data);
      setIsUserModalOpen(false);
      console.log("Güncelleme başarılı:", updatedUser);
      alert("User Info başarıyla güncellendi");
    } catch (error) {
      console.error("User güncelleme hatası:", error);
    }
  };

  // COMPANY INFO UPDATE/ADD BUTTON HANDLER
  const handleCompInfoSubmit = async (e) => {
    e.preventDefault();
    try {
      if (companyInfoData.companyId) {
        const updatedCompany = await updateCompanyInfo(user, companyInfoData);
        console.log("Firma güncellendi:", updatedCompany);
        //setResume(updatedCompany.data);
        setIsCompUpdateModalOpen(false);
        alert("Firma başarıyla güncellendi");
      } else {
        const userId = user.id;
        const newCompany = await addCompanyInfo(user, userId, companyInfoData);
        console.log("Firma eklendi:", newCompany);
        setCompanyInfoData(newCompany.data)
        //setResume(newCompany.data);
        setIsCompAddModalOpen(false);
        alert("Şirket başarıyla eklendi");
      }
    } catch (error) {
      console.error("Firma işlemi hatası:", error);
    }
  };

  // CV ADD/UPDATE BUTTON HANDLER
  const handleCVSubmit = async (e) => {
    e.preventDefault();
    try {
      if (cvFormData.resumeId) {
        const updatedResume = await updateResume(
          user,
          cvFormData,
          selectedCompetences
        );
        console.log("CV güncellendi:", updatedResume);
        setResume(updatedResume.data);
        alert("CV başarıyla güncellendi");
      } else {
        const newResume = await addResume(
          user,
          cvFormData,
          selectedCompetences
        );
        console.log("CV eklendi:", newResume);
        setResume(newResume.data);
        alert("CV başarıyla eklendi");
      }
    } catch (error) {
      console.error("CV işlemi hatası:", error);
    }
  };

// JOBPOSTING DELETE
const handleDeleteClick = async (jobId) => {
  try {
    const success = await deleteJobPosting(user, jobId);
    if (success) {
      setJobPostingsData((prevData) => prevData.filter((job) => job.id !== jobId));
      alert("İş ilanı başarıyla silindi.");
    }
  } catch (error) {
    console.error("Silme işlemi hatası:", error);
  }
};





  return (
    <div className="w-full min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto pt-20 px-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Kullanıcı Bilgileri (Sol Kısım - Daha Küçük) */}
        <div className="bg-white p-6 rounded-lg shadow-md col-span-1">
          <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6">
            <div className="flex flex-col items-center relative">
              <div className="relative">
                <img
                  src="https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png"
                  alt="Avatar"
                  className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
                />
                <div className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-2 cursor-pointer hover:bg-blue-600 transition">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 21v-4.25M3 13.25V9m0 0V4.25M7.5 21v-8.25M7.5 12.25V9m0 0V3.75M12 21v-5.25M12 15V9m0 0V3.25M16.5 21v-2.25M16.5 16.5V9m0 0V3.75M21 21v-7.75M21 12.25V9m0 0V2.75"
                    />
                  </svg>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-gray-800 mt-4">
                {userInfoData?.fullName}
              </h2>
              <p className="text-gray-600">{userInfoData?.email}</p>

              <button
                onClick={() => setIsUserModalOpen(true)}
                className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 flex items-center"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
                Profili Düzenle
              </button>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
                  Hesap Bilgileri
                </h3>
                <InfoItem
                  label="Kullanıcı Adı"
                  value={userInfoData?.userName}
                />
                <InfoItem
                  label="Telefon"
                  value={userInfoData?.phoneNumber || "-"}
                />
                <InfoItem
                  label="Rol"
                  value={user?.role == "JobSeeker" ? "İş Arayan" : "İşveren"}
                />
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
                  İletişim Bilgileri
                </h3>
                <InfoItem label="Email" value={userInfoData?.email} />
                <InfoItem
                  label="Kayıt Tarihi"
                  value={userInfoData?.CreatedTime}
                />{" "}
                {/* Örnek veri */}
              </div>
            </div>

            {/* Profil Düzenleme Modalı */}
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
        </div>

        {/* CV Formu (Sağ Kısım - Daha Büyük) */}
        {user?.role == "JobSeeker" ? (
          <div className="bg-white p-6 rounded-lg shadow-md col-span-2">
            <h2 className="text-2xl font-semibold mb-4">
              {resume ? "CV Güncelle" : "CV Oluştur"}
            </h2>
            <form onSubmit={handleCVSubmit} className="space-y-4">
              <div>
                <label className="block font-medium">Başlık</label>
                <input
                  type="text"
                  name="title"
                  value={cvFormData.title}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block font-medium">Özet</label>
                <textarea
                  name="summary"
                  value={cvFormData.summary}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  rows="4"
                ></textarea>
              </div>
              <div>
                <label className="block font-medium">Deneyim</label>
                <textarea
                  name="experience"
                  value={cvFormData.experience}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  rows="4"
                ></textarea>
              </div>
              <div>
                <label className="block font-medium">Eğitim</label>
                <textarea
                  name="education"
                  value={cvFormData.education}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  rows="4"
                ></textarea>
              </div>
              {/* Competence Seçim Alanı */}
              <div>
                <label className="block font-medium">Yetkinlikler</label>
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
              <div>
                <label className="block font-medium">CV Dosyası</label>
                <input
                  type="file"
                  name="cvFile"
                  onChange={handleFileChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-md"
              >
                Kaydet
              </button>
            </form>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-md col-span-2">
            <h2 className="text-2xl font-bold mb-4">Firma Bilgileri</h2>

            {companyInfoData ? (
              <div>
                <p>
                  <strong>Firma Adı:</strong> {companyInfoData.name}
                </p>
                <p>
                  <strong>Endüstri:</strong> {companyInfoData.industry}
                </p>
                <p>
                  <strong>Açıklama:</strong>{" "}
                  {companyInfoData.description || "Açıklama eklenmemiş"}
                </p>
                <button
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  onClick={() => setIsCompUpdateModalOpen(true)}
                >
                  Güncelle
                </button>
              </div>
            ) : (
              <button
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                onClick={() => {
                  setCompanyInfoData({
                    name: "",
                    industry: "",
                    description: "",
                  });
                  setIsCompAddModalOpen(true);
                }}
              >
                Ekle
              </button>
            )}

            {/* Company Info Güncelleme Ekranı */}

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

            <h2 className="text-2xl font-bold mt-6 mb-4">İlanlarınız</h2>
            {jobPostingsData.length > 0 ? (
              <ul>
                {jobPostingsData.map((job) => (
                  <li key={job.id} className="border-b py-2">
                    <strong>{job.title}</strong>
                    <div className="mt-2 flex space-x-4">
                      <button
                        onClick={() => navigate(`/job-applications/${job.id}`)}
                        className="text-green-500 hover:text-green-600"
                      >
                        Başvuruları Görüntüle
                      </button>
                      <button
                        onClick={() => navigate(`/updatejobposting/${job.id}`)}
                        className="text-blue-500 hover:text-blue-600"
                      >
                        Güncelle
                      </button>
                      <button
                        onClick={() => handleDeleteClick(job.id)}
                        className="text-red-500 hover:text-red-600"
                      >
                        Sil
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p>İş ilanı bulunmamaktadır.</p>
            )}

            <button
              onClick={() => navigate("/addjobposting")}
              className="mt-4 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              + İş İlanı Ekle
            </button>
          </div>
        )}
      </div>
    </div>
  );
}