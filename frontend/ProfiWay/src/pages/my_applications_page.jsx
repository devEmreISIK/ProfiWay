import React, { useState, useEffect } from 'react';
import { useAuth } from "../context/AuthContext";
import { getApplicationsByUserId } from '../services/ApplicationService';
import { getJobPostingInfo } from '../services/JobPostingService';
import Navbar from '../components/Navbar';
import ApplicationStatus from '../components/applications/ApplicationStatus';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/applications/EmptyState';
import ErrorMessage from '../components/ErrorMessage';
import { Search, ArrowUpDown } from 'lucide-react';

function MyApplicationsPage() {
    const { user } = useAuth();
    const [applications, setApplications] = useState([]);
    const [jobTitles, setJobTitles] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

    useEffect(() => {
        if (user && user.role === 'JobSeeker') {
            const fetchApplications = async () => {
                setLoading(true);
                setError(null);
                try {
                    const data = await getApplicationsByUserId(user);
                    setApplications(data || []);

                    // jobPostingId'lere göre başlıkları çek
                    const titles = {};
                    const uniqueIds = [...new Set(data.map(app => app.jobPostingId))];

                    await Promise.all(
                        uniqueIds.map(async (id) => {
                            const job = await getJobPostingInfo(user, id);
                            titles[id] = job?.title || "İlan Başlığı Yok";
                        })
                    );

                    setJobTitles(titles);
                } catch (err) {
                    setError('Başvurular yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
                    console.error(err);
                } finally {
                    setLoading(false);
                }
            };
            fetchApplications();
        } else {
            setLoading(false);
            if (user && user.role !== 'JobSeeker') {
                setError("Bu sayfayı görüntüleme yetkiniz yok.");
            }
        }
    }, [user]);

    if (loading) return <LoadingSpinner />;
    if (!user) return <ErrorMessage message="Başvurularınızı görmek için lütfen giriş yapın." />;
    if (user.role !== 'JobSeeker') return <ErrorMessage message={error || "Bu sayfayı görüntüleme yetkiniz yok."} />;
    if (error && !loading) return <ErrorMessage message={error} />;
    if (applications.length === 0) return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="container mx-auto px-4 pt-24">
                <EmptyState message="Henüz hiç iş başvurusunda bulunmadınız." />
            </div>
        </div>
    );

    const handleSort = (key) => {
        const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
        setSortConfig({ key, direction });
    };

    const sortedApplications = [...applications].sort((a, b) => {
        if (!sortConfig.key) return 0;

        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
    });

    const filteredApplications = sortedApplications.filter(app =>
        app.id.toString().includes(searchTerm) ||
        jobTitles[app.jobPostingId]?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="container mx-auto px-4 pt-24 pb-12">
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    {/* Header */}
                    <div className="p-6 border-b border-gray-200">
                        <h1 className="text-2xl font-bold text-gray-900">Başvurularım</h1>
                        <p className="mt-2 text-gray-600">Tüm iş başvurularınızı ve durumlarını buradan takip edebilirsiniz.</p>
                    </div>

                    {/* Search Bar */}
                    <div className="p-4 border-b border-gray-200 bg-gray-50">
                        <div className="max-w-md relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Başvuru ID'si veya ilan başlığı ile ara..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 w-full h-11 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th
                                        className="px-6 py-3 text-left text-sm font-medium text-gray-500 cursor-pointer hover:text-gray-700"
                                        onClick={() => handleSort('id')}
                                    >
                                        <div className="flex items-center gap-2">
                                            Başvuru ID
                                            <ArrowUpDown className="h-4 w-4" />
                                        </div>
                                    </th>
                                    <th
                                        className="px-6 py-3 text-left text-sm font-medium text-gray-500"
                                    >
                                        İlan Başlığı
                                    </th>
                                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                                        Başvuru Durumu
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredApplications.map((app) => (
                                    <tr key={app.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            #{app.id}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            {jobTitles[app.jobPostingId] || "Yükleniyor..."}
                                        </td>
                                        <td className="px-6 py-4">
                                            <ApplicationStatus status={app.status} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MyApplicationsPage;
