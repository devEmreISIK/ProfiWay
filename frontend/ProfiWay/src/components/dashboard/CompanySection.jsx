import React from 'react';
import { Building2, Briefcase, Edit3, ExternalLink, Trash2, Plus } from 'lucide-react';
import FormDialog from '../FormDialog';

const CompanySection = ({
  companyInfoData,
  jobPostingsData,
  isCompUpdateModalOpen,
  isCompAddModalOpen,
  setIsCompUpdateModalOpen,
  setIsCompAddModalOpen,
  setCompanyInfoData,
  handleCompanyInfoChange,
  handleCompInfoSubmit,
  handleDeleteClick,
  navigate
}) => {
  return (
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
};

export default CompanySection;