import React, { useState, useEffect } from "react";
import { Building2, MapPin, Briefcase, FileText, Plus, X } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";


const cities = [
  { id: 1, name: 'İstanbul' },
  { id: 2, name: 'Ankara' },
  { id: 3, name: 'İzmir' },
];

const competencies = [
  { id: 1, name: 'React' },
  { id: 2, name: 'JavaScript' },
  { id: 3, name: 'Node.js' },
  { id: 4, name: 'Python' },
  { id: 5, name: 'SQL' },
  { id: 6, name: 'HTML/CSS' },
];

const JobPostingForm = () => {
    const { user } = useAuth();
    
    const [competences, setCompetences] = useState([]);
    const [selectedCompetences, setSelectedCompetences] = useState([]); // Seçilen yetkinlikler

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    companyId: '',
    cityId: '',
    competenceIds: [],
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleCompetencyToggle = (competencyId) => {
    setFormData(prev => ({
      ...prev,
      competenceIds: prev.competenceIds.includes(competencyId)
        ? prev.competenceIds.filter(id => id !== competencyId)
        : [...prev.competenceIds, competencyId]
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'İlan başlığı gereklidir';
    if (!formData.description.trim()) newErrors.description = 'İlan açıklaması gereklidir';
    if (!formData.companyId) newErrors.companyId = 'Şirket seçimi gereklidir';
    if (!formData.cityId) newErrors.cityId = 'Şehir seçimi gereklidir';
    if (formData.competenceIds.length === 0) newErrors.competenceIds = 'En az bir yetenek seçilmelidir';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length === 0) {
      // Form is valid, submit the data
      console.log('Form submitted:', formData);
      // Reset form after successful submission
      setFormData({
        title: '',
        description: '',
        companyId: '',
        cityId: '',
        competenceIds: [],
      });
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Yeni İş İlanı Oluştur</h1>
            <p className="mt-2 text-gray-600">Yeni mezunlar için bir iş ilanı oluşturun.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* İlan Başlığı */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
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
                    errors.title ? 'border-red-300' : 'border-gray-300'
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder="Örn: Junior Frontend Developer"
                />
              </div>
              {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
            </div>

            {/* Şehir Seçimi */}
            <div>
              <label htmlFor="cityId" className="block text-sm font-medium text-gray-700 mb-1">
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
                    errors.cityId ? 'border-red-300' : 'border-gray-300'
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                >
                  <option value="">Şehir Seçin</option>
                  {cities.map(city => (
                    <option key={city.id} value={city.id}>
                      {city.name}
                    </option>
                  ))}
                </select>
              </div>
              {errors.cityId && <p className="mt-1 text-sm text-red-600">{errors.cityId}</p>}
            </div>

            {/* İlan Açıklaması */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
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
                    errors.description ? 'border-red-300' : 'border-gray-300'
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder="İş tanımı, gereksinimler ve beklentiler..."
                />
              </div>
              {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
            </div>

            {/* Yetenekler */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Aranan Yetenekler
              </label>
              <div className="flex flex-wrap gap-2">
                {competencies.map(competency => (
                  <button
                    key={competency.id}
                    type="button"
                    onClick={() => handleCompetencyToggle(competency.id)}
                    className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm transition-colors ${
                      formData.competenceIds.includes(competency.id)
                        ? 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {formData.competenceIds.includes(competency.id) ? (
                      <X className="h-4 w-4 mr-1" />
                    ) : (
                      <Plus className="h-4 w-4 mr-1" />
                    )}
                    {competency.name}
                  </button>
                ))}
              </div>
              {errors.competenceIds && (
                <p className="mt-1 text-sm text-red-600">{errors.competenceIds}</p>
              )}
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
  );
};

export default JobPostingForm;