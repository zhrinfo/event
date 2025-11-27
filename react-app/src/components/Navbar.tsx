import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logout, isAdmin } from '../services/authService';
import './Navbar.css';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('/dashboard');
  const [isScrolled, setIsScrolled] = useState(false);

  // Récupérer les rôles de l'utilisateur
  const userIsAdmin = isAdmin();

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

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="nav-container">
        <Link to="/" className="logo" onClick={() => handleLinkClick('/')}>
          IGA
        </Link>
        
        <ul className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
          {/* Liens pour les admins */}
          {userIsAdmin && (
            <li className={activeLink === '/dashboard' ? 'active' : ''}>
              <Link 
                to="/dashboard" 
                onClick={() => handleLinkClick('/dashboard')}
              >
                Tableau de bord
              </Link>
            </li>
          )}
          
          {userIsAdmin && (
            <li className={activeLink === '/ajouter-event' ? 'active' : ''}>
              <Link 
                to="/ajouter-event" 
                onClick={() => handleLinkClick('/ajouter-event')}
              >
                Ajouter un événement
              </Link>
            </li>
          )}
          
          {/* Liens pour tous les utilisateurs */}
          <li className={activeLink === '/events' ? 'active' : ''}>
            <Link 
              to="/events" 
              onClick={() => handleLinkClick('/events')}
            >
              Liste des événements
            </Link>
          </li>
          
          <li className={activeLink === '/profile' ? 'active' : ''}>
            <Link 
              to="/profile" 
              onClick={() => handleLinkClick('/profile')}
            >
              Mon profil
            </Link>
          </li>
          
          <li>
            <button 
              className="btn-cta"
              onClick={handleLogout}
              style={{ cursor: 'pointer' }}
            >
              Déconnexion
            </button>
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