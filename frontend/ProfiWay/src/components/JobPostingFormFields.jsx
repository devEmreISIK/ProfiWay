import React from 'react';
import { Briefcase, MapPin, FileText } from 'lucide-react';
import Select from "react-select";

const JobPostingFormFields = ({
  formData,
  citiesData,
  competences,
  selectedCompetences,
  errors,
  handleInputChange,
  handleCompetenceChange
}) => {
  return (
    <>
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
              errors.title ? "border-red-300" : "border-gray-300"
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
              errors.description ? "border-red-300" : "border-gray-300"
            } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            placeholder="İş tanımı, gereksinimler ve beklentiler..."
          />
        </div>
        {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
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
        {errors.competenceIds && (
          <p className="mt-1 text-sm text-red-600">{errors.competenceIds}</p>
        )}
      </div>
    </>
  );
};

export default JobPostingFormFields;