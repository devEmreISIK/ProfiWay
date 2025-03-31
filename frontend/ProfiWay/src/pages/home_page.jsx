import { Search, GraduationCap, Briefcase, TrendingUp, Building2, Users } from 'lucide-react';
import React from 'react'

export default function HomePage() {
    return (
        <div className="min-h-screen bg-white">
          {/* Hero Section */}
          <div 
            className="relative h-[600px] bg-cover bg-center"
            style={{
              backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80")'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/30 to-purple-600/30" />
            
            {/* Navigation */}
            <nav className="relative z-10 container mx-auto px-6 py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <GraduationCap className="h-8 w-8 text-white" />
                  <span className="text-2xl font-bold text-white">ProfiWay</span>
                </div>
                <div className="hidden md:flex space-x-8">
                  <a href="#" className="text-white hover:text-blue-200">İş Bul</a>
                  <a href="#" className="text-white hover:text-blue-200">İşverenler</a>
                  <a href="#" className="text-white hover:text-blue-200">Kariyer Rehberi</a>
                  <a href="#" className="text-white hover:text-blue-200">Hakkımızda</a>
                </div>
                <div className="space-x-4">
                  <a href="/login"><button className="px-4 py-2 text-white hover:text-blue-200">Giriş</button></a>
                  <a href="/register"><button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Üye Ol</button></a>
                </div>
              </div>
            </nav>
    
            {/* Hero Content */}
            <div className="relative z-10 container mx-auto px-6 pt-32">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Kariyerinize Başlangıç Yapın
              </h1>
              <p className="text-xl text-white mb-8 max-w-2xl">
                Yeni mezunlar için fırsatlar kapısı. Taze yeteneklere ve yeni bakış açılarına değer veren şirketlerle tanışın.
              </p>
    
              {/* Search Bar */}
              <div className="bg-white p-4 rounded-lg shadow-lg max-w-4xl flex flex-col md:flex-row gap-4">
                <div className="flex-1 flex items-center border-b md:border-b-0 md:border-r border-gray-200 pb-4 md:pb-0 md:pr-4">
                  <Search className="h-5 w-5 text-gray-400 mr-2" />
                  <input
                    type="text"
                    placeholder="İş unvanı veya anahtar kelime"
                    className="w-full focus:outline-none"
                  />
                </div>
                <div className="flex items-center">
                  <Building2 className="h-5 w-5 text-gray-400 mr-2" />
                  <input
                    type="text"
                    placeholder="Konum"
                    className="w-full focus:outline-none"
                  />
                </div>
                <button className="bg-blue-600 text-white px-8 py-2 rounded-lg hover:bg-blue-700">
                  Ara
                </button>
              </div>
            </div>
          </div>
    
          {/* Features Section */}
          <div className="py-20 bg-gray-50">
            <div className="container mx-auto px-6">
              <h2 className="text-3xl font-bold text-center mb-16">Neden ProfiWay?</h2>
              <div className="grid md:grid-cols-3 gap-12">
                <div className="text-center">
                  <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Briefcase className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">Yeni Mezun Odaklı</h3>
                  <p className="text-gray-600">Yeni mezunlar ve kariyerinin başındaki profesyoneller için özel fırsatlar.</p>
                </div>
                <div className="text-center">
                  <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                    <TrendingUp className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">Kariyer Gelişimi</h3>
                  <p className="text-gray-600">Profesyonel becerilerinizi geliştirmeniz ve kariyerinizi ilerletmeniz için kaynaklar.</p>
                </div>
                <div className="text-center">
                  <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Users className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">Network Oluşturma</h3>
                  <p className="text-gray-600">İlk günden itibaren mentorlar ve meslektaşlarla bağlantı kurun.</p>
                </div>
              </div>
            </div>
          </div>
    
          {/* Featured Jobs Section */}
          <div className="py-20">
            <div className="container mx-auto px-6">
              <h2 className="text-3xl font-bold text-center mb-16">Öne Çıkan Fırsatlar</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3].map((job) => (
                  <div key={job} className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold mb-2">Yazılım Geliştirici</h3>
                        <p className="text-gray-600">TechCorp Solutions</p>
                      </div>
                      <img
                        src="https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&q=80&w=74&h=74"
                        alt="Şirket Logosu"
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    </div>
                    <div className="space-y-2 mb-4">
                      <p className="text-gray-600 flex items-center">
                        <Building2 className="h-4 w-4 mr-2" /> İstanbul, Türkiye
                      </p>
                      <p className="text-gray-600">Yeni Mezun • Tam Zamanlı</p>
                    </div>
                    <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                      Başvur
                    </button>
                  </div>
                ))}
              </div>
              <div className="text-center mt-12">
                <button className="px-8 py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50">
                  Tüm İşleri Gör
                </button>
              </div>
            </div>
          </div>
    
          {/* Footer */}
          <footer className="bg-gray-900 text-white py-12">
            <div className="container mx-auto px-6">
              <div className="grid md:grid-cols-4 gap-8">
                <div>
                  <div className="flex items-center space-x-2 mb-6">
                    <GraduationCap className="h-6 w-6" />
                    <span className="text-xl font-bold">ProfiWay</span>
                  </div>
                  <p className="text-gray-400">Yeni mezunları hayallerindeki kariyerle buluşturuyoruz.</p>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-4">İş Arayanlar</h4>
                  <ul className="space-y-2 text-gray-400">
                    <li><a href="#" className="hover:text-white">İş İlanları</a></li>
                    <li><a href="#" className="hover:text-white">Kariyer Kaynakları</a></li>
                    <li><a href="#" className="hover:text-white">CV Oluşturucu</a></li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-4">İşverenler</h4>
                  <ul className="space-y-2 text-gray-400">
                    <li><a href="#" className="hover:text-white">İlan Ver</a></li>
                    <li><a href="#" className="hover:text-white">Yetenek Ara</a></li>
                    <li><a href="#" className="hover:text-white">Fiyatlandırma</a></li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-4">İletişim</h4>
                  <ul className="space-y-2 text-gray-400">
                    <li><a href="#" className="hover:text-white">Hakkımızda</a></li>
                    <li><a href="#" className="hover:text-white">Yardım Merkezi</a></li>
                    <li><a href="#" className="hover:text-white">Gizlilik Politikası</a></li>
                  </ul>
                </div>
              </div>
              <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
                <p>&copy; 2025 ProfiWay. Tüm hakları saklıdır.</p>
              </div>
            </div>
          </footer>
        </div>
      );
}

