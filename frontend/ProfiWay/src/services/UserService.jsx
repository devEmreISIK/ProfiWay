import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export async function getUserInfo(user) {
  try {
    const response = await axios.get(
      `${API_URL}/api/Users/getbyid?id=${user.id}`,
      {
        headers: { Authorization: `Bearer ${user.token}` },
      }
    );

    if (response.data) {
      return {
        fullName: response.data.fullName || "",
        email: response.data.email || "",
        userName: response.data.userName || "",
        phoneNumber: response.data.phoneNumber || "",
        createdTime: response.data.createdTime || "",
      };
    }
  } catch (error) {
    if (error.response && error.response.status === 404) {
      console.warn("Kullanıcı bilgileri bulunamadı.");
    } else {
      console.error("Bir hata oluştu:", error);
    }
    return null;
  }
}

export async function updateUserInfo(user, userInfoData) {
  const jsonDataUserInfo = {
    Id: user.id,
    FullName: userInfoData.fullName,
    UserName: userInfoData.userName,
    Email: userInfoData.email,
    PhoneNumber: userInfoData.phoneNumber,
  };

  try {
    const response = await axios.put(
      `${API_URL}/api/Users/update`,
      jsonDataUserInfo,
      {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (err) {
    console.error(
      "API Güncelleme Hatası:",
      err.response ? err.response.data : err.message
    );
    throw err;
  }
}
