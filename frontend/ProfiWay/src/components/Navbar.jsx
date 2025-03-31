// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-blue-600 text-white fixed w-full top-0 left-0 z-50">
      <div className="container mx-auto flex justify-between items-center p-4">
        <Link to="/" className="text-2xl font-semibold">ProfiWay</Link>
        <ul className="flex space-x-4">
          <li>
            <Link to="/dashboard" className="hover:underline">Dashboard</Link>
          </li>
          <li>
            <Link to="/job-postings" className="hover:underline">İş İlanları</Link>
          </li>
          <li>
            <Link to="/career-guide" className="hover:underline">Kariyer Rehberi</Link>
          </li>
          <li>
            <Link to="/logout" className="hover:underline">Çıkış</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
