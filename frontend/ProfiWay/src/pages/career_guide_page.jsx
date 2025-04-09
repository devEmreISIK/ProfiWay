import React from 'react';
import { 
  BookOpen, 
  Target, 
  Users, 
  Briefcase, 
  Award, 
  TrendingUp, 
  FileText, 
  MessageSquare,
  Lightbulb,
  CheckCircle,
  Clock,
  Star,
  ChevronRight
} from 'lucide-react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';




const CareerGuide = () => {
  const navigate = useNavigate();




  const resources = [
    {
      title: "CV Hazırlama Rehberi",
      icon: FileText,
      description: "Etkili bir CV nasıl hazırlanır? İpuçları ve örneklerle adım adım CV hazırlama kılavuzu.",
      link: "#cv-guide"
    },
    {
      title: "Mülakat Teknikleri",
      icon: MessageSquare,
      description: "İş görüşmelerinde başarılı olmanın yolları, sık sorulan sorular ve cevap önerileri.",
      link: "#interview-tips"
    },
    {
      title: "Kariyer Planlama",
      icon: Target,
      description: "Kariyerinizi planlamak için pratik öneriler ve stratejiler.",
      link: "#career-planning"
    }
  ];

  const tips = [
    {
      title: "Networking Önemi",
      description: "Profesyonel ağınızı genişletmek kariyeriniz için kritik öneme sahiptir.",
      icon: Users
    },
    {
      title: "Sürekli Öğrenme",
      description: "Kendinizi sürekli geliştirin ve yeni beceriler edinin.",
      icon: TrendingUp
    },
    {
      title: "İş-Yaşam Dengesi",
      description: "Kariyerinizde başarılı olurken kişisel yaşamınızı da ihmal etmeyin.",
      icon: Clock
    }
  ];

  const interviewQuestions = [
    "Kendinizden bahseder misiniz?",
    "Neden bizimle çalışmak istiyorsunuz?",
    "5 yıl sonra kendinizi nerede görüyorsunuz?",
    "Güçlü ve zayıf yönleriniz nelerdir?",
    "Stresli durumlarla nasıl başa çıkarsınız?"
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 py-16 pt-32">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Kariyer Rehberi</h1>
            <p className="text-xl text-blue-100">
              Kariyerinizi şekillendirmenize yardımcı olacak kapsamlı rehber ve öneriler
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Resources Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {resources.map((resource, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <resource.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold ml-4">{resource.title}</h3>
              </div>
              <p className="text-gray-600 mb-4">{resource.description}</p>
              <a 
                href={resource.link} 
                className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
              >
                Daha Fazla Bilgi
                <ChevronRight className="w-4 h-4 ml-1" />
              </a>
            </div>
          ))}
        </div>

        {/* Interview Tips Section */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-16">
          <div className="flex items-center mb-8">
            <MessageSquare className="w-8 h-8 text-blue-600 mr-4" />
            <h2 className="text-2xl font-bold">Mülakat Soruları ve Öneriler</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Sık Sorulan Sorular</h3>
              <ul className="space-y-4">
                {interviewQuestions.map((question, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-1" />
                    <span>{question}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Mülakat İpuçları</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <Star className="w-5 h-5 text-yellow-500 mr-3 flex-shrink-0 mt-1" />
                  <span>Şirket hakkında önceden araştırma yapın</span>
                </li>
                <li className="flex items-start">
                  <Star className="w-5 h-5 text-yellow-500 mr-3 flex-shrink-0 mt-1" />
                  <span>Profesyonel bir görünüm ve duruş sergileyin</span>
                </li>
                <li className="flex items-start">
                  <Star className="w-5 h-5 text-yellow-500 mr-3 flex-shrink-0 mt-1" />
                  <span>Sorulara net ve özgüvenli cevaplar verin</span>
                </li>
                <li className="flex items-start">
                  <Star className="w-5 h-5 text-yellow-500 mr-3 flex-shrink-0 mt-1" />
                  <span>Kendi sorularınızı hazırlayın</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Career Tips Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {tips.map((tip, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm p-6">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                <tip.icon className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{tip.title}</h3>
              <p className="text-gray-600">{tip.description}</p>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-sm p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Kariyerinizi Şekillendirin</h2>
          <p className="text-lg mb-6">
            Profesyonel gelişiminiz için size özel fırsatları keşfedin
          </p>
          <button onClick={() => navigate("/joblistings")} className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
            İş İlanlarını Görüntüle
          </button>
        </div>
      </div>
    </div>
  );
};

export default CareerGuide;