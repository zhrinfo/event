import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('/dashboard');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLinkClick = (path: string) => {
    setActiveLink(path);
    setIsMenuOpen(false);
  };

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="nav-container">
        <Link to="/" className="logo" onClick={() => handleLinkClick('/')}>
          IGA
        </Link>
        
        <ul className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
          <li className={activeLink === '/dashboard' ? 'active' : ''}>
            <Link 
              to="/dashboard" 
              onClick={() => handleLinkClick('/dashboard')}
            >
              Tableau de bord
            </Link>
          </li>
          <li className={activeLink === '/ajouter-event' ? 'active' : ''}>
            <Link 
              to="/ajouter-event" 
              onClick={() => handleLinkClick('/ajouter-event')}
            >
              Ajouter un événement
            </Link>
          </li>
          <li className={activeLink === '/events' ? 'active' : ''}>
            <Link 
              to="/events" 
              onClick={() => handleLinkClick('/events')}
            >
              Liste des événements
            </Link>
          </li>
          <li>
            <Link 
              to="/logout" 
              className="btn-cta"
              onClick={() => handleLinkClick('/logout')}
            >
              Déconnexion
            </Link>
          </li>
        </ul>

        <div 
          className={`menu-toggle ${isMenuOpen ? 'active' : ''}`} 
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;