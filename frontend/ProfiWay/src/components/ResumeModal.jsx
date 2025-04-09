import React from 'react';


export default function ResumeModal({ user, resume, onClose, onApprove, onReject }) {

  const getSafeValue = (obj, path, defaultValue = 'N/A') => {
    if (!obj) return defaultValue;
    return path.split('.').reduce((acc, part) => acc && acc[part], obj) ?? defaultValue;
  };

  const renderCompetences = (competences) => {

    if (!competences) return <p className="text-gray-600 text-sm">Yetkinlik bilgisi yok.</p>;

    if (Array.isArray(competences) && competences.length > 0 && typeof competences[0] === 'object' && competences[0]?.competenceName) {
      return (
        <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
          {competences.map((comp, index) => (
            <li key={comp.id || index}>{comp.competenceName}</li> 
          ))}
        </ul>
      );
    }

    if (Array.isArray(competences) && competences.length > 0 && typeof competences[0] === 'object' && competences[0]?.name) {
      return (
        <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
          {competences.map((comp, index) => (
            <li key={comp.id || index}>{comp.name}</li> 
          ))}
        </ul>
      );
    }

    if (Array.isArray(competences) && competences.length > 0 && typeof competences[0] === 'string') {
        return <p className="text-gray-600 text-sm">{competences.join(', ')}</p>;
    }


    console.warn("Unknown resumeCompetences structure:", competences);
    return <p className="text-gray-600 text-sm">Yetkinlikler gösterilemiyor (yapı kontrol edilmeli).</p>;
  };


  if (!resume) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center p-4 transition-opacity duration-300">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto m-4 flex flex-col"> {/* Flex column */}

        {/* Başlık ve Kapatma */}
        <div className="flex justify-between items-center p-4 md:p-6 border-b sticky top-0 bg-white z-10">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">{resume.title || 'Başlıksız CV'}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-full hover:bg-gray-100" 
            aria-label="Kapat"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* İçerik Alanı */}
        <div className="p-4 md:p-6 space-y-5 flex-grow">
            {/* Kullanıcı Bilgileri */}
             <div className='mb-5'>
                <h3 className="text-lg font-semibold text-gray-700 mb-2 border-b pb-1">Başvuran Bilgileri</h3>
                {user && Object.keys(user).length > 0 ? (
                     <div className="text-sm space-y-1">
                        <p><span className='font-medium'>Ad Soyad:</span> {getSafeValue(user, 'fullName')}</p>
                        <p><span className='font-medium'>E-posta:</span> {getSafeValue(user, 'email')}</p>
                        <p><span className='font-medium'>Telefon:</span> {getSafeValue(user, 'phoneNumber')}</p>
                     </div>
                ) : (
                    <p className="text-red-500 text-sm mt-1">Başvuran bilgileri yüklenemedi.</p>
                )}
            </div>

           {/* CV Detayları */}
            <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2 border-b pb-1">CV Detayları</h3>
                <div className="space-y-3">
                    <div>
                        <h4 className="font-semibold text-gray-600 text-sm">Özet</h4>
                        <p className="text-gray-700 text-sm mt-1">{resume.summary || 'N/A'}</p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-600 text-sm">Deneyim</h4>
                        <p className="text-gray-700 text-sm mt-1 whitespace-pre-wrap">{resume.experience || 'N/A'}</p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-600 text-sm">Eğitim</h4>
                        <p className="text-gray-700 text-sm mt-1 whitespace-pre-wrap">{resume.education || 'N/A'}</p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-600 text-sm">Yetkinlikler</h4>
                        {/* API Yanıtına göre competence'ları render et */}
                        {renderCompetences(resume.resumeCompetences)}
                    </div>
                </div>
            </div>
        </div>

        {/* Footer - Butonlar */}
        <div className="flex justify-end gap-4 p-4 border-t sticky bottom-0 bg-gray-50 z-10">
            <button
              onClick={onClose} 
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 transition-colors text-sm"
            >
              Kapat
            </button>
            <button
              onClick={onReject}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-colors text-sm"
            >
              Reddet
            </button>
            <button
              onClick={onApprove}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-colors text-sm"
            >
              Onayla
            </button>
         </div>

      </div>
    </div>
  );
}