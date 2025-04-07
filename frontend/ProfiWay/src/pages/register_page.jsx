import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function RegisterPage() {
  const [userName, setUserName] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [isJobSeeker, setIsJobSeeker] = useState(false); // Varsayılan olarak iş arayan
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    // Şifre doğrulaması
    if (password !== confirmPassword) {
      setError("Şifreler uyuşmuyor");
      return;
    }

    const user = {
      userName,
      fullName,
      email,
      isJobSeeker,
      password,
    };

    try {
      const response = await fetch("https://localhost:7198/api/Auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },   
        body: JSON.stringify(user),
      });

      if (response.ok) {
        // Kayıt başarılıysa login sayfasına yönlendirelim
        navigate("/login");
      } else {
        // Eğer hata varsa, hata mesajını göster
        const result = await response.json();
        setError(result.message || "Bir şeyler ters gitti");
      }
    } catch (err) {
      setError("Kayıt sırasında bir hata oluştu");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Kayıt Ol</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        
        <form onSubmit={handleRegister}>
          <div className="mb-4">
            <label htmlFor="userName" className="block text-gray-700">Kullanıcı Adı</label>
            <input
              type="text"
              id="userName"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
              className="w-full p-3 mt-1 border border-gray-300 rounded-md"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="fullName" className="block text-gray-700">Ad Soyad</label>
            <input
              type="text"
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="w-full p-3 mt-1 border border-gray-300 rounded-md"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700">E-posta</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 mt-1 border border-gray-300 rounded-md"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700">Şifre</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 mt-1 border border-gray-300 rounded-md"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block text-gray-700">Şifreyi Onayla</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full p-3 mt-1 border border-gray-300 rounded-md"
            />
          </div>

          {/* İş Arayan Olup Olmama */}
          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={!isJobSeeker}
                onChange={() => setIsJobSeeker(!isJobSeeker)}
                className="mr-2"
              />
              Firma Sahibiyim - İş İlanı Vereceğim
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Kayıt Ol
          </button>
        </form>
        
        <div className="mt-4 text-center">
          <p className="text-gray-600">Hesabınız var mı? <a href="/login" className="text-blue-600 hover:underline">Giriş Yap</a></p>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
