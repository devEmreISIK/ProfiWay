import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, Briefcase, Filter, Building2 } from 'lucide-react';
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";

export default function JobListings() {
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        
    })

    // Mock data for jobs
const initialJobs = [
    {
      id: 1,
      title: "Junior Frontend Developer",
      company: "Tech Solutions Inc.",
      location: "İstanbul",
      type: "Tam Zamanlı",
      skills: ["React", "JavaScript", "HTML", "CSS"],
      posted: "2 gün önce"
    },
    {
      id: 2,
      title: "Junior Backend Developer",
      company: "Digital Dynamics",
      location: "Ankara",
      type: "Tam Zamanlı",
      skills: ["Node.js", "Python", "SQL"],
      posted: "1 hafta önce"
    },
    {
      id: 3,
      title: "UI/UX Designer",
      company: "Creative Works",
      location: "İzmir",
      type: "Uzaktan",
      skills: ["Figma", "Adobe XD", "UI Design"],
      posted: "3 gün önce"
    }
  ];
  
    const [jobs, setJobs] = useState(initialJobs);
    const [filters, setFilters] = useState({
      location: '',
      type: '',
      skill: ''
    });
  
    const locations = ["İstanbul", "Ankara", "İzmir"];
    const types = ["Tam Zamanlı", "Yarı Zamanlı", "Uzaktan"];
    const skills = ["React", "JavaScript", "Python", "Node.js", "SQL", "UI Design", "HTML", "CSS"];
  
    const handleFilterChange = (key, value) => {
      setFilters(prev => ({ ...prev, [key]: value }));
    };



  return (
     <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Navbar/>
    <div className="container mx-auto pt-20 gap-6">
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Pozisyon, şirket veya anahtar kelime"
                className="pl-10 w-full h-11 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex-1 relative">
              <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <select
                className="pl-10 w-full h-11 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
              >
                <option value="">Tüm Lokasyonlar</option>
                {locations.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>
            <div className="flex-1 relative">
              <Briefcase className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <select
                className="pl-10 w-full h-11 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={filters.skill}
                onChange={(e) => handleFilterChange('skill', e.target.value)}
              >
                <option value="">Tüm Yetenekler</option>
                {skills.map(skill => (
                  <option key={skill} value={skill}>{skill}</option>
                ))}
              </select>
            </div>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtrele
            </button>
          </div>
        </div>

        {/* Job Listings */}
        <div className="space-y-4">
          {jobs.map(job => (
            <div key={job.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-gray-900">{job.title}</h2>
                  <div className="mt-2 flex items-center gap-4 text-gray-600">
                    <span className="flex items-center gap-1">
                      <Building2 className="h-4 w-4" />
                      {job.company}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {job.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Briefcase className="h-4 w-4" />
                      {job.type}
                    </span>
                  </div>
                </div>
                <div className="mt-4 md:mt-0">
                  <span className="text-sm text-gray-500">{job.posted}</span>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {job.skills.map(skill => (
                  <span key={skill} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {skill}
                  </span>
                ))}
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  {job.type}
                </span>
              </div>
              <button className="mt-4 w-full md:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Başvur
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
      
    </div>
  )
} 


