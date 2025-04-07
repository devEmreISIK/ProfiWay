import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from './pages/home_page';
import LoginPage from './pages/login_page';
import RegisterPage from './pages/register_page';
import Dashboard from './pages/dashboard_page';
import { AuthProvider } from './context/AuthContext';
import JobListings from './pages/job_listing_page';
import JobPostingForm from './pages/job_add_page';
import JobPostingUpdatePage from './pages/job_posting_update_page';
import JobDetail from './pages/job_detail_page';
import JobApplications from './pages/job_applications_page';
import MyApplicationsPage from './pages/my_applications_page';
import CareerGuide from './pages/career_guide_page';


function App() {
  return(
    <AuthProvider>
      <Router>
        <Routes>
          <Route path='/' element={<HomePage/>}/>
          <Route path='/login' element={<LoginPage/>}/>
          <Route path='/register' element={<RegisterPage/>}/>
          <Route path='/dashboard' element={<Dashboard/>}/>
          <Route path='/joblistings' element={<JobListings/>}/>
          <Route path='/addjobposting' element={<JobPostingForm/>}/>
          <Route path='/updatejobposting/:jobPostingId' element={<JobPostingUpdatePage/>}/>
          <Route path='/jobs/:id' element={<JobDetail/>}/>
          <Route path="/job-applications/:jobId" element={<JobApplications />} />
          <Route path="/myapplications" element={<MyApplicationsPage />} />
          <Route path="/career-guide" element={<CareerGuide />} />
        </Routes>
     </Router>
    </AuthProvider>
    
  )
}

export default App;