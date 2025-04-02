import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Select from "react-select";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField } from "@mui/material";


export default function Dashboard() {
  const { user } = useAuth();
  const [userInfoData, setUserInfoData] = useState({
    fullName: "",
    userName: "",
    email: "",
    phoneNumber: "",
    createdTime: ""
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
  const [selectedCompetences, setSelectedCompetences] = useState([]); // Seçilen yetkinlikler
  const [resume, setResume] = useState(null);
  const [info, setInfo] = useState(null);
  
  const navigate = useNavigate();

  const [jobPostings, setJobPostings] = useState([]);
  const [companyInfoData, setCompanyInfoData] = useState({
     name: "", 
     industry: "",
     description: "" 
    });
  const [isCompModalOpen, setIsCompModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [companyInfo, setCompanyInfo] = useState(null);



  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    axios
      .get(`${import.meta.env.VITE_API_URL}/api/Users/getbyid?id=${user.id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      })
      .then((response) => {
        if (response.data) {
          // Response boş değilse
          setUserInfoData({
            fullName: response.data.fullName || "",
            email: response.data.email || "",
            userName: response.data.userName || "",
            phoneNumber: response.data.phoneNumber || "",
            createdTime : response.data.createdTime || ""
          });
          console.log(userInfoData);
        }
      })
      .catch((error) => {
        if (error.response && error.response.status === 404) {
          console.warn("Kullanıcı bilgileri bulunamadı.");
        } else {
          console.error("Bir hata oluştu:", error);
        }
      });

      // COMPANIES GET BY ID
      if (!user || !(user.isJobSeeker)) {

        axios.get(`${import.meta.env.VITE_API_URL}/api/JobPostings/getbyuserid?id=${user.id}`, {
          headers: { Authorization: `Bearer ${user.token}` }
        })
        .then(response => setJobPostings(response.data))
        .catch(err => console.error("İş ilanları çekilirken hata oluştu:", err));


        axios.get(`${import.meta.env.VITE_API_URL}/api/Companies/getbyid?id=${user.id}`, {
          headers: { Authorization: `Bearer ${user.token}` }
        })
        .then((response) => {
          setCompanyInfoData({
            companyId: response.data.id,
            name: response.data.name,
            industry: response.data.industry,
            description: response.data.description
          });
        })
        .catch(err => console.error("Firma bilgileri çekilirken hata oluştu:", err));
      }

    axios
      .get(
        `${import.meta.env.VITE_API_URL}/api/Resumes/getbyid?id=${user.id}`,
        { headers: { Authorization: `Bearer ${user.token}` } }
      )
      .then((response) => {
        console.log("API Yanıtı:", response.data);
        if (response.data && response.data.id) {
          setResume(response.data); //setResume(response.data[0]);
          
          setCvFormData({
            resumeId: response.data.id,
            title: response.data.title || "",
            summary: response.data.summary || "",
            experience: response.data.experience || "",
            education: response.data.education || "",
            cvFile: null,
            competences: response.data.resumeCompetences || [],
          });

          setSelectedCompetences(response.data.resumeCompetences.map((comp) => ({
            value: comp.id,
            label: comp.name
          })));
        }
        
      })
      .catch((err) => console.error(err));
      

    axios
      .get(`${import.meta.env.VITE_API_URL}/api/Competences/getall`, {
        headers: { Authorization: `Bearer ${user.token}` },
      })
      .then((response) => {
        setCompetences(response.data.map(comp => ({
          value: comp.id,
          label: comp.name
        })));
        console.log("Competences:", competences);
      })
      .catch((err) => console.error(err));
  }, [user, navigate]);

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
    })
  }

  const handleFileChange = (e) => {
    setCvFormData({
      ...cvFormData,
      cvFile: e.target.files[0],
    });
  }

  const handleCompanyInfoChange = (e) => {
    setCompanyInfoData({
      ...companyInfoData,
      [e.target.name]: e.target.value,
    })
  }

  // Yetkinlik seçim işlemi
  const handleCompetenceChange = (selectedOptions) => {
    setSelectedCompetences(selectedOptions);
  };

  const handleUserInfoSubmit = (e) => {
    e.preventDefault();

    const jsonDataUserInfo = {
      Id: user.id,
      FullName: userInfoData.fullName,
      UserName: userInfoData.userName,
      Email: userInfoData.email,
      PhoneNumber: userInfoData.phoneNumber
    }

    
    axios
      .put(
        `${import.meta.env.VITE_API_URL}/api/Users/update`,
        jsonDataUserInfo,
        {
          headers: { Authorization: `Bearer ${user.token}`, "Content-Type": "application/json" },
        },
        console.log("Gönderilen veri:", jsonDataUserInfo)
      )
      .then((response) => {
        console.log("Güncelleme başarılı, API yanıtı:", response);
        alert("User Info başarıyla güncellendi");
        setInfo(response.data);
        setIsUserModalOpen(false)
      })
      .catch((err) => {
        console.error("API Güncelleme Hatası:", err.response ? err.response.data : err.message);
      });
    
  }

  const handleCompInfoSubmit = (e) => {
    e.preventDefault();

    const jsonData = {
      UserId: user.id,
      Name: companyInfoData.name,
      Description: companyInfoData.description,
      Industry: companyInfoData.industry
    }

    const jsonDataToUpdate = {
      Id: companyInfoData.companyId,
      Name: companyInfoData.name,
      Description: companyInfoData.description,
      Industry: companyInfoData.industry
    }

    if (companyInfoData.companyId != null) {
      console.log("UPDATE!")
      axios
        .put(
          `${import.meta.env.VITE_API_URL}/api/Companies/update`,
          jsonDataToUpdate,
          {
            headers: { Authorization: `Bearer ${user.token}` },
            "Content-Type": "application/json"
          }
        )
        .then((response) => {
          alert("Firma başarıyla güncellendi");
          setResume(response.data);
          setIsCompModalOpen(false);
        })
        .catch((err) => console.error(err));
    } else {
      console.log("ADD!")
      axios.post(`${import.meta.env.VITE_API_URL}/api/Companies/add`, JSON.stringify(jsonData), {
        headers: { 
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json"
        }
      })
      .then(response => {
        alert("Şirket başarıyla eklendi");
        setResume(response.data);
      })
      .catch(err => {
        console.error("Hata detayları:", err.response?.data); // Hata detayını yazdır!
        console.log(jsonData);
      });
    }
  }
  
 ///

  const handleCVSubmit = (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("UserId", user.id);
    formDataToSend.append("Title", cvFormData.title);
    formDataToSend.append("Summary", cvFormData.summary);
    formDataToSend.append("Experience", cvFormData.experience);
    formDataToSend.append("Education", cvFormData.education);
    if (cvFormData.cvFile) {
      formDataToSend.append("CvFilePath", cvFormData.cvFile);
    } else{
      formDataToSend.append("CvFilePath", "string");
    }

    /*selectedCompetences.forEach((id) => {
      formDataToSend.append("competenceIds", id);
    }); */

    /*selectedCompetences.forEach((id) => {
      formDataToSend.append("competenceIds", id);
    });*/

    const jsonData = {
      UserId: user.id,
      Title: cvFormData.title,
      Summary: cvFormData.summary,
      Experience: cvFormData.experience,
      Education: cvFormData.education,
      CvFilePath: cvFormData.cvFile ? "uploaded_file_path" : "string",
      CompetenceIds: selectedCompetences.map(c => c.value)  //CompetenceIds: selectedCompetences,
    };

    const jsonDataToUpdate = {
      Id: cvFormData.resumeId,
      Title: cvFormData.title,
      Summary: cvFormData.summary,
      Experience: cvFormData.experience,
      Education: cvFormData.education,
      CvFilePath: cvFormData.cvFile ? "uploaded_file_path" : "string",
      CompetenceIds: selectedCompetences.map(c => c.value)  //CompetenceIds: selectedCompetences,
    }
    
    //formDataToSend.append("CompetenceIds", JSON.stringify(selectedCompetences));

    if (cvFormData.resumeId != null) {
      console.log("UPDATE!")
      axios
        .put(
          `${import.meta.env.VITE_API_URL}/api/Resumes/update`,
          jsonDataToUpdate,
          {
            headers: { Authorization: `Bearer ${user.token}`, "Content-Type": "application/json" },
          }
        )
        .then((response) => {
          alert("CV başarıyla güncellendi");
          setResume(response.data);
        })
        .catch((err) => console.error(err));
    } else {
      console.log("ADD!")
      axios.post(`${import.meta.env.VITE_API_URL}/api/Resumes/add`, JSON.stringify(jsonData), {
        headers: { 
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json"
        }
      })
      .then(response => {
        alert("CV başarıyla eklendi");
        setResume(response.data);
      })
      .catch(err => {
        console.error("Hata detayları:", err.response?.data); // Hata detayını yazdır!
        console.log(jsonData);
      });
    }; 
  }


  const InfoItem = ({ label, value }) => (
    <div className="flex justify-between items-center py-2 border-b last:border-b-0">
      <span className="text-gray-600">{label}</span>
      <span className="text-gray-800 font-medium">{value}</span>
    </div>
  );


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
                <InfoItem label="Kullanıcı Adı" value={userInfoData?.userName} />
                <InfoItem
                  label="Telefon"
                  value={userInfoData?.phoneNumber || "-"}
                />
                <InfoItem
                  label="Rol"
                  value={userInfoData?.isJobSeeker ? "İş Arayan" : "İşveren"}
                />
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
                  İletişim Bilgileri
                </h3>
                <InfoItem label="Email" value={userInfoData?.email} />
                <InfoItem label="Kayıt Tarihi" value={userInfoData?.CreatedTime} />{" "}
                {/* Örnek veri */}
              </div>
            </div>

            {/* Profil Düzenleme Modalı */}
            {isUserModalOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-xl w-full max-w-md p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold">Profili Düzenle</h3>
                    <button
                      onClick={() => setIsUserModalOpen(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      ✕
                    </button>
                  </div>

                  <form className="space-y-2" onSubmit={handleUserInfoSubmit}>
                    <div>
                      <label className="block font-medium">Tam Ad</label>
                      <textarea
                        label="Tam Ad"
                        value={userInfoData.fullName}
                        name="fullName"
                        onChange={handleUserInfoChange}
                      ></textarea>
                    </div>
                    <div>
                      <label className="block font-medium">Kullanıcı Adı</label>
                      <textarea
                        label="Kullanıcı Adı"
                        value={userInfoData.userName}
                        name="userName"
                        onChange={handleUserInfoChange}
                      ></textarea>
                    </div>
                    <div>
                      <label className="block font-medium">Email</label>
                      <textarea
                        label="Email"
                        value={userInfoData.email}
                        name="email"
                        onChange={handleUserInfoChange}
                        type="email"
                      ></textarea>
                    </div>
                    <div>
                      <label className="block font-medium">Telefon Numarası</label>
                      <textarea
                        label="Telefon"
                        value={userInfoData.phoneNumber}
                        name="phoneNumber"
                        onChange={handleUserInfoChange}
                      ></textarea>
                    </div>

                    <div className="flex justify-end space-x-3 mt-6">
                      <button
                        type="button"
                        onClick={() => setIsUserModalOpen(false)}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800"
                      >
                        İptal
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                      >
                        Kaydet
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* CV Formu (Sağ Kısım - Daha Büyük) */}
        {userInfoData?.isJobSeeker ? 
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
        </div> : 
        <div className="bg-white p-6 rounded-lg shadow-md col-span-2">
        <h2 className="text-2xl font-bold mb-4">Firma Bilgileri</h2>
        
        {companyInfoData ? (
          <div>
            <p><strong>Firma Adı:</strong> {companyInfoData.name}</p>
            <p><strong>Endüstri:</strong> {companyInfoData.industry}</p>
            <p><strong>Açıklama:</strong> {companyInfoData.description || "Açıklama eklenmemiş"}</p>
            <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600" onClick={() => setIsCompModalOpen(true)}>
              Güncelle
            </button>

            {/* Company Info Güncelleme Ekranı */}

            {isCompModalOpen && (
              <Dialog open={open} onClose={() => setIsCompModalOpen(false)}>
              <DialogTitle>Firma Bilgilerini Güncelle</DialogTitle>
              <DialogContent>
                <TextField
                  label="Firma Adı"
                  name="name"
                  fullWidth
                  margin="dense"
                  value={companyInfoData.name}
                  onChange={handleCompanyInfoChange}
                />
                <TextField
                  label="Endüstri"
                  name="industry"
                  fullWidth
                  margin="dense"
                  value={companyInfoData.industry}
                  onChange={handleCompanyInfoChange}
                />
                <TextField
                  label="Açıklama"
                  name="description"
                  fullWidth
                  margin="dense"
                  value={companyInfoData.description}
                  onChange={handleCompanyInfoChange}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setIsCompModalOpen(false)} color="secondary">
                  İptal
                </Button>
                <Button onClick={handleCompInfoSubmit} color="primary">
                  Kaydet
                </Button>
              </DialogActions>
            </Dialog>
            )}
          </div>
        ) : (
          <p>Firma bilgileri yükleniyor...</p>
        )}
    
        <h2 className="text-2xl font-bold mt-6 mb-4">İlanlarınız</h2>
        {jobPostings.length > 0 ? (
          <ul>
            {jobPostings.map(job => (
              <li key={job.id} className="border-b py-2">
                <strong>{job.title}</strong> - {job.location} 
              </li>
            ))}
          </ul>
        ) : (
          <p>Henüz iş ilanı eklenmemiş.</p>
        )}
    
        <button 
          onClick={() => navigate("/add-job-posting")} 
          className="mt-4 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
        >
          + İş İlanı Ekle
        </button>
      </div>
      
      }    
        
      </div> 
    </div>
  );
}