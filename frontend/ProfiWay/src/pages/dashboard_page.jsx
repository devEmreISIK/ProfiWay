import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Select from "react-select";

export default function Dashboard() {
  const { user } = useAuth();
  const [userInfo, setUserInfo] = useState({
    fullName: "",
    userName: "",
    email: "",
    phoneNumber: "",
    createdTime: ""
  });
  const [formData, setFormData] = useState({
    title: "",
    summary: "",
    experience: "",
    education: "",
    cvFile: null,
  });

  //const resumeId = "";

  const [competences, setCompetences] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCompetences, setSelectedCompetences] = useState([]); // Seçilen yetkinlikler
  const [resume, setResume] = useState(null);
  const [info, setInfo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    // axios.get(${import.meta.env.VITE_API_URL}/api/Users/getbyid?id=${user.id}, { headers: { Authorization: Bearer ${user.token} } })
    //   .then(response => setUserInfo(response.data))
    //   .catch(err => console.error(err));

    axios
      .get(`${import.meta.env.VITE_API_URL}/api/Users/getbyid?id=${user.id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      })
      .then((response) => {
        if (response.data) {
          // Response boş değilse
          setUserInfo({
            fullName: response.data.fullName || "",
            email: response.data.email || "",
            userName: response.data.userName || "",
            phoneNumber: response.data.phoneNumber || "",
            createdTime : response.data.createdTime || ""
          });
          console.log(userInfo);
        }
      })
      .catch((error) => {
        if (error.response && error.response.status === 404) {
          console.warn("Kullanıcı bilgileri bulunamadı.");
        } else {
          console.error("Bir hata oluştu:", error);
        }
      });

    axios
      .get(
        `${import.meta.env.VITE_API_URL}/api/Resumes/getbyid?id=${user.id}`,
        { headers: { Authorization: `Bearer ${user.token}` } }
      )
      .then((response) => {
        console.log("API Yanıtı:", response.data);
        if (response.data && response.data.id) {
          setResume(response.data); //setResume(response.data[0]);
          
          setFormData({
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
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUserInfoChange = (e) => {
    setUserInfo({
      ...userInfo,
      [e.target.name]: e.target.value,
    })
  }

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      cvFile: e.target.files[0],
    });
  };

  // Yetkinlik seçim işlemi
  const handleCompetenceChange = (selectedOptions) => {
    setSelectedCompetences(selectedOptions);
  };

  const handleUserInfoSubmit = (e) => {
    e.preventDefault();

    const jsonDataUserInfo = {
      Id: user.id,
      FullName: userInfo.fullName,
      UserName: userInfo.userName,
      Email: userInfo.email,
      PhoneNumber: userInfo.phoneNumber
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
          setIsModalOpen(false)
        })
        .catch((err) => {
          console.error("API Güncelleme Hatası:", err.response ? err.response.data : err.message);
        });

  }

  const handleSubmit = (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("UserId", user.id);
    formDataToSend.append("Title", formData.title);
    formDataToSend.append("Summary", formData.summary);
    formDataToSend.append("Experience", formData.experience);
    formDataToSend.append("Education", formData.education);
    if (formData.cvFile) {
      formDataToSend.append("CvFilePath", formData.cvFile);
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
      Title: formData.title,
      Summary: formData.summary,
      Experience: formData.experience,
      Education: formData.education,
      CvFilePath: formData.cvFile ? "uploaded_file_path" : "string",
      CompetenceIds: selectedCompetences.map(c => c.value)  //CompetenceIds: selectedCompetences,
    };

    const jsonDataToUpdate = {
      Id: formData.resumeId,
      Title: formData.title,
      Summary: formData.summary,
      Experience: formData.experience,
      Education: formData.education,
      CvFilePath: formData.cvFile ? "uploaded_file_path" : "string",
      CompetenceIds: selectedCompetences.map(c => c.value)  //CompetenceIds: selectedCompetences,
    }
    
    //formDataToSend.append("CompetenceIds", JSON.stringify(selectedCompetences));

    if (formData.resumeId != null) {
      console.log("UPDATE!")
      axios
        .put(
          `${import.meta.env.VITE_API_URL}/api/Resumes/update`,
          jsonDataToUpdate,
          {
            headers: { Authorization: `Bearer ${user.token}` },
            "Content-Type": "application/json"
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

  const InputField = ({ label, defaultValue, type = "text" }) => (
    <div className="form-control">
      <label className="label">
        <span className="label-text">{label}</span>
      </label>
      <input
        type={type}
        defaultValue={defaultValue}
        className="input input-bordered w-full"
      />
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
                {userInfo?.fullName}
              </h2>
              <p className="text-gray-600">{userInfo?.email}</p>

              <button
                onClick={() => setIsModalOpen(true)}
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
                <InfoItem label="Kullanıcı Adı" value={userInfo?.userName} />
                <InfoItem
                  label="Telefon"
                  value={userInfo?.phoneNumber || "-"}
                />
                <InfoItem
                  label="Rol"
                  value={userInfo?.isJobSeeker ? "İş Arayan" : "İşveren"}
                />
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
                  İletişim Bilgileri
                </h3>
                <InfoItem label="Email" value={userInfo?.email} />
                <InfoItem label="Kayıt Tarihi" value={userInfo?.CreatedTime} />{" "}
                {/* Örnek veri */}
              </div>
            </div>

            {/* Profil Düzenleme Modalı */}
            {isModalOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-xl w-full max-w-md p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold">Profili Düzenle</h3>
                    <button
                      onClick={() => setIsModalOpen(false)}
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
                        value={userInfo.fullName}
                        name="fullName"
                        onChange={handleUserInfoChange}
                      ></textarea>
                    </div>
                    <div>
                      <label className="block font-medium">Kullanıcı Adı</label>
                      <textarea
                        label="Kullanıcı Adı"
                        value={userInfo.userName}
                        name="userName"
                        onChange={handleUserInfoChange}
                      ></textarea>
                    </div>
                    <div>
                      <label className="block font-medium">Email</label>
                      <textarea
                        label="Email"
                        value={userInfo.email}
                        name="email"
                        onChange={handleUserInfoChange}
                        type="email"
                      ></textarea>
                    </div>
                    <div>
                      <label className="block font-medium">Telefon Numarası</label>
                      <textarea
                        label="Telefon"
                        value={userInfo.phoneNumber}
                        name="phoneNumber"
                        onChange={handleUserInfoChange}
                      ></textarea>
                    </div>

                    <div className="flex justify-end space-x-3 mt-6">
                      <button
                        type="button"
                        onClick={() => setIsModalOpen(false)}
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
        <div className="bg-white p-6 rounded-lg shadow-md col-span-2">
          <h2 className="text-2xl font-semibold mb-4">
            {resume ? "CV Güncelle" : "CV Oluştur"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-medium">Başlık</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block font-medium">Özet</label>
              <textarea
                name="summary"
                value={formData.summary}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                rows="4"
              ></textarea>
            </div>
            <div>
              <label className="block font-medium">Deneyim</label>
              <textarea
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                rows="4"
              ></textarea>
            </div>
            <div>
              <label className="block font-medium">Eğitim</label>
              <textarea
                name="education"
                value={formData.education}
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
      </div>
    </div>
  );
}
