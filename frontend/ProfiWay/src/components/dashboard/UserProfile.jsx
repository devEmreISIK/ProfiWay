import React from 'react';
import { User, Edit3, Briefcase } from 'lucide-react';
import { InfoItem } from '../InfoItem';
import FormDialog from '../FormDialog';

const UserProfile = ({ 
  userInfoData, 
  user, 
  isUserModalOpen, 
  setIsUserModalOpen, 
  handleUserInfoChange,
  handleUserInfoSubmit,
  navigate 
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 lg:col-span-1">
      <div className="flex flex-col items-center">
        <div className="relative">
          <div className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
            <User className="w-16 h-16 text-white" />
          </div>
          <div className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-2 cursor-pointer hover:bg-blue-700 transition-colors">
            <Edit3 className="w-5 h-5 text-white" />
          </div>
        </div>

        <h2 className="mt-4 text-2xl font-bold text-gray-900">{userInfoData?.fullName}</h2>
        <p className="text-gray-600">{userInfoData?.email}</p>

        <div className="mt-6 w-full grid grid-cols-1 gap-4">
          <button
            onClick={() => setIsUserModalOpen(true)}
            className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Edit3 className="w-4 h-4 mr-2" />
            Profili Düzenle
          </button>

          {user?.role === "JobSeeker" && (
            <button
              onClick={() => navigate(`/myapplications`)}
              className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Briefcase className="w-4 h-4 mr-2" />
              Başvurularım
            </button>
          )}
        </div>

        <div className="mt-8 w-full space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">
              Hesap Bilgileri
            </h3>
            <InfoItem label="Kullanıcı Adı" value={userInfoData?.userName} />
            <InfoItem label="Rol" value={user?.role === "JobSeeker" ? "İş Arayan" : "İşveren"} />
            <InfoItem label="Kayıt Tarihi" value={userInfoData?.createdTime} />
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">
              İletişim Bilgileri
            </h3>
            <InfoItem label="Email" value={userInfoData?.email} />
            <InfoItem label="Telefon" value={userInfoData?.phoneNumber || "-"} />
          </div>
        </div>
      </div>

      {isUserModalOpen && (
        <FormDialog
          open={isUserModalOpen}
          onClose={() => setIsUserModalOpen(false)}
          title="Profili Düzenle"
          fields={[
            { name: "fullName", label: "Tam Ad" },
            { name: "userName", label: "Kullanıcı Adı" },
            { name: "email", label: "Email", type: "email" },
            { name: "phoneNumber", label: "Telefon Numarası" },
          ]}
          formData={userInfoData}
          onChange={handleUserInfoChange}
          onSubmit={handleUserInfoSubmit}
        />
      )}
    </div>
  );
};

export default UserProfile;