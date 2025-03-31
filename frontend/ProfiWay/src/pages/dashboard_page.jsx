import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

export default function Dashboard() {
    const { user } = useAuth();
    const [userInfo, setUserInfo] = useState(null);
    const [formData, setFormData] = useState({
      title: '',
      summary: '',
      experience: '',
      education: '',
      cvFile: null,
    });
    
    
    const [resume, setResume] = useState(null);
    const navigate = useNavigate();
  
    useEffect(() => {
      if (!user) {
        navigate('/login');
        return;
      }
  
      axios.get(`${import.meta.env.VITE_API_URL}/api/User/info`, { headers: { Authorization: `Bearer ${user.token}` } })
        .then(response => setUserInfo(response.data))
        .catch(err => console.error(err));
  
      axios.get(`${import.meta.env.VITE_API_URL}/api/Resumes/getbyid?id=${user.id}`, { headers: { Authorization: `Bearer ${user.token}` } })
        .then(response => {
          if (response.data && response.data.length > 0) {
            setResume(response.data[0]);
            setFormData({
              title: response.data[0].title || '',
              summary: response.data[0].summary || '',
              experience: response.data[0].experience || '',
              education: response.data[0].education || '',
              cvFile: null,
            });
          }
        })
        .catch(err => console.error(err));
    }, [user, navigate]);
  
    const handleChange = (e) => {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    };
  
    const handleFileChange = (e) => {
      setFormData({
        ...formData,
        cvFile: e.target.files[0],
      });
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
  
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('summary', formData.summary);
      formDataToSend.append('experience', formData.experience);
      formDataToSend.append('education', formData.education);
      if (formData.cvFile) {
        formDataToSend.append('cvFile', formData.cvFile);
      }
      
      if (resume.id != null) {
        axios.put(`${import.meta.env.VITE_API_URL}/api/Resumes/update/${resume.id}`, formDataToSend, {
            headers: { Authorization: `Bearer ${user.token}` }
          })
          .then(response => {
            alert('CV başarıyla güncellendi');
            setResume(response.data);
          })
          .catch(err => console.error(err));
      }

      axios.put(`${import.meta.env.VITE_API_URL}/api/Resumes/add`, formDataToSend, {
        //headers: { Authorization: `Bearer ${user.token}` }
      })
      .then(response => {
        alert('CV başarıyla eklendi');
        setResume(response.data);
      })
      .catch(err => console.error(err));
      
    };
  
    return (
      <div className="w-full min-h-screen bg-gray-100">
        <Navbar />
        <div className="container mx-auto pt-20 px-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Kullanıcı Bilgileri (Sol Kısım - Daha Küçük) */}
          <div className="bg-white p-6 rounded-lg shadow-md col-span-1">
            <div className="flex flex-col items-center">
              <img 
                src="https://via.placeholder.com/150" 
                alt="Avatar" 
                className="w-24 h-24 rounded-full border-2 border-gray-300"
              />
              <h2 className="text-lg font-semibold mt-4">{userInfo?.fullName}</h2>
              <p className="text-gray-600">{userInfo?.email}</p>
            </div>
            <div className="mt-4 text-sm">
              <h3 className="font-semibold">Kullanıcı Bilgileri</h3>
              <p><strong>Email:</strong> {userInfo?.email}</p>
              <p><strong>Rol:</strong> {userInfo?.isJobSeeker ? 'İş Arayan' : 'İşveren'}</p>
            </div>
          </div>
  
          {/* CV Formu (Sağ Kısım - Daha Büyük) */}
          <div className="bg-white p-6 rounded-lg shadow-md col-span-2">
            <h2 className="text-2xl font-semibold mb-4">{resume ? 'CV Güncelle' : 'CV Oluştur'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-medium">Başlık</label>
                <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" />
              </div>
              <div>
                <label className="block font-medium">Özet</label>
                <textarea name="summary" value={formData.summary} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" rows="4"></textarea>
              </div>
              <div>
                <label className="block font-medium">Deneyim</label>
                <textarea name="experience" value={formData.experience} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" rows="4"></textarea>
              </div>
              <div>
                <label className="block font-medium">Eğitim</label>
                <textarea name="education" value={formData.education} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" rows="4"></textarea>
              </div>
              <div>
                <label className="block font-medium">CV Dosyası</label>
                <input type="file" name="cvFile" onChange={handleFileChange} className="w-full p-2 border border-gray-300 rounded-md" />
              </div>
              <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-md">Kaydet</button>
            </form>
          </div>
        </div>
      </div>
    );
  }
