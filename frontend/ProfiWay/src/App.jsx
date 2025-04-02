import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from './pages/home_page';
import LoginPage from './pages/login_page';
import RegisterPage from './pages/register_page';
import Dashboard from './pages/dashboard_page';
import { AuthProvider } from './context/AuthContext';
import JobListings from './pages/job_listing_page';


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
        </Routes>
     </Router>
    </AuthProvider>
    
  )
}

export default App;