import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, Briefcase, BookOpen, LogOut, Menu, X, User } from 'lucide-react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full top-0 left-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white shadow-md' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className={`flex items-center space-x-2 text-2xl font-bold ${
              isScrolled ? 'text-blue-600' : 'text-purple-900'
            }`}
          >
            <Briefcase className="h-8 w-8" />
            <span>ProfiWay</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink to="/dashboard" icon={<Home className="h-5 w-5" />} isScrolled={isScrolled}>
              Dashboard
            </NavLink>
            <NavLink to="/joblistings" icon={<Briefcase className="h-5 w-5" />} isScrolled={isScrolled}>
              İş İlanları
            </NavLink>
            <NavLink to="/career-guide" icon={<BookOpen className="h-5 w-5" />} isScrolled={isScrolled}>
              Kariyer Rehberi
            </NavLink>
            
            {/* Profile Button */}
            <div className="relative ml-4">
              <button 
                className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors ${
                  isScrolled 
                    ? 'bg-blue-600 text-purple-900 hover:bg-blue-700' 
                    : 'bg-white/10 text-purple-900 hover:bg-white/20'
                }`}
              >
                <User className="h-5 w-5" />
                <span>Profilim</span>
              </button>
            </div>

            {/* Logout Button */}
            <Link 
              to="/logout"
              className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors ${
                isScrolled 
                  ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                  : 'bg-white/10 text-purple-900 hover:bg-white/20'
              }`}
            >
              <LogOut className="h-5 w-5" />
              <span>Çıkış</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className={`md:hidden p-2 rounded-lg ${
              isScrolled ? 'text-gray-600' : 'text-purple-900'
            }`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden text-purple-900 border-t">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <MobileNavLink to="/dashboard" icon={<Home className="h-5 w-5" />}>
                Dashboard
              </MobileNavLink>
              <MobileNavLink to="/joblistings" icon={<Briefcase className="h-5 w-5" />}>
                İş İlanları
              </MobileNavLink>
              <MobileNavLink to="/career-guide" icon={<BookOpen className="h-5 w-5" />}>
                Kariyer Rehberi
              </MobileNavLink>
              <MobileNavLink to="/profile" icon={<User className="h-5 w-5" />}>
                Profilim
              </MobileNavLink>
              <MobileNavLink to="/logout" icon={<LogOut className="h-5 w-5" />}>
                Çıkış
              </MobileNavLink>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

// Desktop Navigation Link Component
const NavLink = ({ to, children, icon, isScrolled }) => (
  <Link
    to={to}
    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
      isScrolled 
        ? 'text-gray-700 hover:text-blue-600 hover:bg-blue-50' 
        : 'text-purple-900 hover:text-blue-600 hover:bg-white/10'
    }`}
  >
    {icon}
    <span>{children}</span>
  </Link>
);

// Mobile Navigation Link Component
const MobileNavLink = ({ to, children, icon }) => (
  <Link
    to={to}
    className="flex items-center space-x-3 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-50 hover:text-blue-600"
  >
    {icon}
    <span>{children}</span>
  </Link>
);

export default Navbar;