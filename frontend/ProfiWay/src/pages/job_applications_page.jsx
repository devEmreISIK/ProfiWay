import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ResumeModal from '../components/ResumeModal';
import { getJobPostingInfo } from '../services/JobPostingService';
import { getApplicationsByJobPosting, updateApplicationStatus } from '../services/ApplicationService';
import { getResumeInfo } from '../services/ResumeService'; 
import { getUserInfo } from '../services/UserService';
import Navbar from '../components/Navbar';

export default function JobApplications() {
    const { jobId } = useParams();
    const { user } = useAuth(); 
    const navigate = useNavigate();

    const [job, setJob] = useState(null);
    const [applications, setApplications] = useState([]);
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [userCache, setUserCache] = useState({});
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState(null);
    const [statusUpdateError, setStatusUpdateError] = useState(null);
    const [modalLoading, setModalLoading] = useState(false); 

   
    const fetchData = useCallback(async () => {
        setLoading(true);
        setLoadError(null);
        console.log(`Workspaceing data for jobId: ${jobId}`);
        try {
            const [jobData, apps] = await Promise.all([
                getJobPostingInfo(user, jobId),
                getApplicationsByJobPosting(user, jobId)
            ]);

            console.log('API Response - Job Info:', jobData);
            console.log('API Response - Applications:', apps);

            if (!jobData || !jobData.id) {
                console.error("Job data is missing or invalid:", jobData);
                throw new Error("İş ilanı bilgileri alınamadı.");
            }
            setJob(jobData);
            setApplications(apps || []);

        } catch (error) {
            console.error("Veri yüklenemedi:", error);
            setLoadError(error.message || "İlan veya başvurular yüklenirken bir hata oluştu.");
        } finally {
            setLoading(false);
        }
    }, [jobId, user]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    
    const handleStatusUpdate = async (applicationId, status) => {
        if (!applicationId) {
            console.error("handleStatusUpdate: applicationId is missing!");
            return;
        }
        setStatusUpdateError(null);
        console.log(`Updating status for application ${applicationId} to ${status}`);
        try {
            await updateApplicationStatus(user, applicationId, status);
            setApplications(prev => prev.map(app =>
                app.id === applicationId ? { ...app, status } : app
            ));
            setSelectedApplication(null); 
            console.log(`Application ${applicationId} status updated successfully.`);
        } catch (error) {
            console.error(`Durum güncellenemedi (ID: ${applicationId}):`, error);
            const errorMsg = error.response?.data?.message || "Başvuru durumu güncellenirken bir hata oluştu.";
            setStatusUpdateError(errorMsg);
            alert(`Hata: ${errorMsg}`);
        }
    };

    const openApplicationModal = async (application) => {
        console.log('Attempting to open modal for application:', JSON.stringify(application, null, 2));

        if (!application || !application.id || !application.userId) {
            console.error("Modal açma hatası: Geçersiz başvuru nesnesi (id veya userId eksik).", application);
            alert("Başvuru bilgileri hatalı, detaylar gösterilemiyor.");
            return;
        }

        setStatusUpdateError(null);
        setModalLoading(true); 
        setSelectedApplication({ id: application.id, status: application.status }); 

        try {
            let applicantUser = userCache[application.userId];
            let applicantResume = null; 

            const [userInfoResult, resumeInfoResult] = await Promise.all([
                applicantUser ? Promise.resolve(applicantUser) : getUserInfo({ ...user, id: application.userId }).catch(err => {
                    console.error(`Kullanıcı bilgisi alınamadı (userId: ${application.userId}):`, err);
                    return null; 
                }),
                getResumeInfo({ ...user, id: application.userId }).catch(err => {
                    console.error(`CV bilgisi alınamadı (userId: ${application.userId}):`, err);
                    return null; 
                })
            ]);

            applicantUser = userInfoResult; 
            applicantResume = resumeInfoResult; 

            console.log('Fetched User Info:', applicantUser);
            console.log('Fetched Resume Info:', applicantResume);


            if (!userCache[application.userId] && applicantUser) {
                 setUserCache((prev) => ({ ...prev, [application.userId]: applicantUser }));
            }

            if (!applicantResume || !applicantResume.id) { 
                 console.error("CV bilgisi alınamadı veya geçersiz.");
                 alert("Başvuranın CV bilgisine ulaşılamadı.");
                 setModalLoading(false); 
                 setSelectedApplication(null); 
                 return; 
            }

            const modalData = {
                id: application.id, 
                status: application.status, 
                userId: application.userId, 
                user: applicantUser, 
                resume: applicantResume 
            };
            console.log('Setting selectedApplication state:', JSON.stringify(modalData, null, 2));
            setSelectedApplication(modalData); 

        } catch (error) {
             console.error("Modal verisi hazırlanırken hata oluştu:", error);
             alert("Başvuru detayları yüklenirken bir hata oluştu.");
             setSelectedApplication(null); 
        } finally {
             setModalLoading(false); 
        }
    };


    if (loading) return <div className="p-8 text-center">Sayfa Yükleniyor...</div>;
    if (loadError) return <div className="p-8 text-center text-red-600">Hata: {loadError}</div>;
    if (!job) return <div className="p-8 text-center text-red-600">İş ilanı bilgileri yüklenemedi.</div>;

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <Navbar/>
            <div className='container mx-auto pt-20 px-6 gap-6'>
                <div className="max-w-6xl mx-auto">
            </div>
                {/* İlan Detayları */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                   {/* ... (job title, description, geri dön butonu - aynı) ... */}
                   <h1 className="text-3xl font-bold mb-4">{job.title}</h1>
                   <p className="text-gray-600 mb-4">{job.description}</p>
                   <button onClick={() => navigate(-1)} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">Geri Dön</button>
                </div>

                {/* Hata Mesajı Alanı */}
                {statusUpdateError && (
                     <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                         <span className="block sm:inline">{statusUpdateError}</span>
                         <button onClick={() => setStatusUpdateError(null)} className='absolute top-0 bottom-0 right-0 px-4 py-3'> {/* ... (kapatma ikonu) ... */} </button>
                     </div>
                 )}

                 {/* Başvurular */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                     {/* Tüm Başvurular */}
                     <div className="lg:col-span-2">
                         <h2 className="text-2xl font-bold mb-4">Tüm Başvurular ({applications.length})</h2>
                         <div className="space-y-4">
                             {applications.length === 0 ? (
                                 <p className="text-gray-500">Bu ilana henüz başvuru yapılmamış.</p>
                             ) : (
                                applications.map((application) => {
                                    const applicantName = userCache[application.userId]?.fullName;
                                    return (
                                        <div
                                            key={application.id}
                                            className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md cursor-pointer transition-shadow relative" 
                                            onClick={() => !modalLoading && openApplicationModal(application)} 
                                        >
                                            {/* Modal verisi yükleniyorsa gösterge */}
                                            {modalLoading && selectedApplication?.id === application.id && (
                                                <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg z-10">
                                                    <span className="text-sm text-blue-600">Yükleniyor...</span>
                                                </div>
                                            )}
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <h3 className="font-semibold">
                                                        {/* CV başlığı artık modal açılınca gelecek, burada gösterilemez */}
                                                        {/* Başvuranın adını gösterelim */}
                                                        {applicantName || `Başvuru ID: ${application.id}`}
                                                    </h3>
                                                    <p className="text-sm text-gray-500 mt-1">
                                                        {application.status === 1 ? <span className="text-green-600 font-medium">✅ Onaylandı</span> // Enum değerlerine göre (0: Pending, 1: Accepted, 2: Rejected varsayımı)
                                                        : application.status === 2 ? <span className="text-red-600 font-medium">❌ Reddedildi</span>
                                                        : <span className="text-yellow-600 font-medium">🕒 Beklemede</span>}
                                                    </p>
                                                </div>
                                                 {/* İsteğe bağlı: Başvuranın e-postası vb. */}
                                                {applicantName && <span className='text-xs text-gray-500 hidden md:block'>{userCache[application.userId]?.email}</span>}
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>

                     {/* Onaylananlar */}
                    <div>
                         <h2 className="text-2xl font-bold mb-4">Onaylananlar</h2>
                         <div className="space-y-4">
                             {applications.filter((app) => app.status === 1).length === 0 ? ( 
                                 <p className="text-gray-500">Henüz onaylanan başvuru yok.</p>
                             ) : (
                                 applications
                                     .filter((app) => app.status === 1) 
                                     .map((application) => (
                                         <div key={application.id} className="bg-green-50 p-4 rounded-lg shadow-sm border border-green-200">
                                             <h3 className="font-semibold">{userCache[application.userId]?.fullName || `User ID: ${application.userId}`}</h3>
                                             {/* CV Özeti burada gösterilemez */}
                                             {/* <p className="text-sm text-green-700 truncate mt-1">...</p> */}
                                              <button onClick={() => !modalLoading && openApplicationModal(application)} className="text-xs text-blue-600 hover:underline mt-2">Detayları Gör</button>
                                         </div>
                                     ))
                             )}
                         </div>
                     </div>
                 </div>

                 {/* Resume Modal */}
                {/* selectedApplication varsa VE içinde geçerli bir resume objesi varsa modal'ı render et */}
                {selectedApplication && selectedApplication.resume && selectedApplication.resume.id && !modalLoading && (
                     <ResumeModal
                         user={selectedApplication.user || {}} 
                         resume={selectedApplication.resume} 
                         applicationId={selectedApplication.id} 
                         onClose={() => setSelectedApplication(null)}
                         onApprove={() => handleStatusUpdate(selectedApplication.id, 1)} 
                         onReject={() => handleStatusUpdate(selectedApplication.id, 2)} 
                     />
                 )}

            </div>
        </div>
    );
}