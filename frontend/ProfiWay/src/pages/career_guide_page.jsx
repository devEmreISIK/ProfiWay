import React from 'react';

function CareerGuide() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-200 to-gray-100">
      <div className="bg-white p-10 rounded-xl shadow-lg text-center max-w-md">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">🚧 Yapım Aşamasında 🚧</h1>
        <p className="text-gray-600 text-lg mb-6">
          Bu sayfa üzerinde çalışmalarımız devam ediyor. Yakında burada harika içerikler olacak! 
        </p>
        <button 
          className="bg-blue-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-600 transition duration-300"
          onClick={() => window.history.back()}
        >
          Geri Dön
        </button>
      </div>
    </div>
  );
}

export default CareerGuide;