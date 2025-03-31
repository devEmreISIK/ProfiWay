import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';  // AuthContext'i kullan

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const { login } = useAuth();  // login fonksiyonunu al

  const handleLogin = async () => {
    setError('');
    try {
      // AuthContext'teki login fonksiyonunu kullanıyoruz
      await login(email, password);
      navigate('/dashboard');  // Başarılı giriş sonrası dashboard sayfasına yönlendiriyoruz
    } catch (err) {
      setError('Giriş başarısız. Lütfen bilgilerinizi kontrol edin.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Giriş Yap</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <div className="mb-4">
          <label className="block text-gray-700">E-posta</label>
          <input 
            type="email" 
            className="w-full p-2 border border-gray-300 rounded mt-1"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Şifre</label>
          <input 
            type="password" 
            className="w-full p-2 border border-gray-300 rounded mt-1"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button 
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          onClick={handleLogin}
        >
          Giriş Yap
        </button>
        <div className="flex justify-between mt-4">
          <a href="#" className="text-blue-500 text-sm">Şifremi Unuttum</a>
          <a href="/register" className="text-blue-500 text-sm">Kayıt Ol</a>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
