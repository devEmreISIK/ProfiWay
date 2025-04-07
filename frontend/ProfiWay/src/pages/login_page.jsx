import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const { login } = useAuth();

  const handleLogin = async () => {
    setError('');
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError('Giriş başarısız. Lütfen bilgilerinizi kontrol edin.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-300 to-purple-700">
      <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-md transform transition hover:scale-105">
        <h2 className="text-3xl font-extrabold text-gray-800 text-center mb-8">
          ProfiWay'a Hoş Geldiniz
        </h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <div className="mb-6">
          <label className="block text-gray-600 font-medium mb-2">E-posta</label>
          <input
            type="email"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="E-posta adresinizi girin"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-600 font-medium mb-2">Şifre</label>
          <input
            type="password"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Şifrenizi girin"
          />
        </div>
        <button
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 shadow-md transition duration-300"
          onClick={handleLogin}
        >
          Giriş Yap
        </button>
        <div className="flex justify-between mt-6 text-sm">
          <a href="#" className="text-blue-300 hover:text-white transition duration-200">
            Şifremi Unuttum
          </a>
          <a href="/register" className="text-blue-300 hover:text-white transition duration-200">
            Kayıt Ol
          </a>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;