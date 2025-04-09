import React from 'react';
import { FileText, GraduationCap } from 'lucide-react';
import Select from "react-select";

const CVForm = ({
  resume,
  cvFormData,
  handleChange,
  handleFileChange,
  handleCVSubmit,
  competences,
  selectedCompetences,
  handleCompetenceChange
}) => {
  return (
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
  );
};

export default CVForm;