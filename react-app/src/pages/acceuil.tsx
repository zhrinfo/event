import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './acceuil.css';
import { Calendar, Clock, Users, MapPin, CheckCircle, Mail, Phone, Map, Facebook, Twitter, Instagram, Linkedin, User, Briefcase, Users as TeamIcon, Target, Award, Code2, Palette, Star, Music, Camera, Utensils, Mic2, Heart } from 'lucide-react';

export default function Accueil() {
  const navigate = useNavigate();

  const features = [
    { icon: <Calendar size={20} />, title: "Inscription Rapide", description: "Inscrivez-vous aux événements en quelques clics" },
    { icon: <Clock size={20} />, title: "Programme en Temps Réel", description: "Consultez les événements à venir instantanément" },
    { icon: <Users size={20} />, title: "Communauté Active", description: "Rejoignez une communauté passionnée d'événements" },
    { icon: <MapPin size={20} />, title: "Localisation", description: "Trouvez des événements près de chez vous" },
  ];

  const upcomingEvents = [
    { name: "Concert Jazz & Wine", type: "Musique", date: "15 Déc 2024", location: "Paris", available: true, price: "35€" },
    { name: "Festival Gastronomique", type: "Culinaire", date: "20 Déc 2024", location: "Lyon", available: true, price: "50€" },
    { name: "Conférence Innovation", type: "Business", date: "10 Jan 2025", location: "Toulouse", available: false, price: "75€" },
    { name: "Exposition Art Moderne", type: "Art", date: "5 Jan 2025", location: "Marseille", available: true, price: "20€" },
  ];

  const eventCategories = [
    { name: "Musique", icon: <Music size={24} />, count: "45 événements" },
    { name: "Art & Culture", icon: <Palette size={24} />, count: "32 événements" },
    { name: "Gastronomie", icon: <Utensils size={24} />, count: "28 événements" },
    { name: "Business", icon: <Briefcase size={24} />, count: "38 événements" },
    { name: "Sport", icon: <Target size={24} />, count: "25 événements" },
    { name: "Conférences", icon: <Mic2 size={24} />, count: "42 événements" },
  ];

  const teamMembers = [
    {
      name: "Jean Dupont",
      role: "Directeur Événements",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      social: {
        twitter: "#",
        linkedin: "#",
        github: "#"
      }
    },
    {
      name: "Marie Martin",
      role: "Responsable Programmation",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
      social: {
        twitter: "#",
        linkedin: "#",
        github: "#"
      }
    },
    {
      name: "Thomas Leroy",
      role: "Coordinateur Logistique",
      image: "https://randomuser.me/api/portraits/men/22.jpg",
      social: {
        twitter: "#",
        linkedin: "#",
        github: "#"
      }
    },
    {
      name: "Sophie Bernard",
      role: "Chargée de Communication",
      image: "https://randomuser.me/api/portraits/women/65.jpg",
      social: {
        twitter: "#",
        linkedin: "#",
        github: "#"
      }
    },
    {
      name: "Alexandre Petit",
      role: "Responsable Partenariats",
      image: "https://randomuser.me/api/portraits/men/45.jpg",
      social: {
        twitter: "#",
        linkedin: "#",
        github: "#"
      }
    },
    {
      name: "Camille Laurent",
      role: "Community Manager",
      image: "https://randomuser.me/api/portraits/women/33.jpg",
      social: {
        twitter: "#",
        linkedin: "#",
        github: "#"
      }
    }
  ];
  
  const [currentSlide, setCurrentSlide] = useState(0);
  const membersPerPage = 4;
  const totalSlides = Math.ceil(teamMembers.length / membersPerPage);
  
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
  };
  
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  };
  
  const visibleMembers = teamMembers.slice(
    currentSlide * membersPerPage,
    (currentSlide * membersPerPage) + membersPerPage
  );

  const services = [
    {
      icon: <Calendar size={28} className="service-icon" />,
      title: "Programmation Événements",
      description: "Découvrez des événements exclusifs toute l'année"
    },
    {
      icon: <TeamIcon size={28} className="service-icon" />,
      title: "Réseautage",
      description: "Connectez-vous avec des passionnés comme vous"
    },
    {
      icon: <Target size={28} className="service-icon" />,
      title: "Événements Sur Mesure",
      description: "Des expériences personnalisées selon vos goûts"
    },
    {
      icon: <Award size={28} className="service-icon" />,
      title: "Billeterie Premium",
      description: "Accès prioritaire et avantages exclusifs"
    },
    {
      icon: <Star size={28} className="service-icon" />,
      title: "Événements VIP",
      description: "Accès à des événements privés et rencontres"
    },
    {
      icon: <Heart size={28} className="service-icon" />,
      title: "Communauté Engagée",
      description: "Rejoignez une communauté vibrante et active"
    }
  ];

  return (
    <div className="acceuil-container">
      {/* decorative animated background circles */}
      <div className="floating-circles" aria-hidden="true">
        <span className="circle c1" />
        <span className="circle c2" />
        <span className="circle c3" />
        <span className="circle c4" />
      </div>
      
      {/* Header */}
      <header className="site-header">
        <div className="container">
          <div className="brand">
            <div className="logo"><Calendar size={20} color="#fff" /></div>
            <div className="title">EventFinder</div>
          </div>
          <nav className="site-nav">
            <a href="#">Accueil</a>
            <a href="#">Événements</a>
            <a href="#">Catégories</a>
            <a href="#">Mes Réservations</a>
            <a href="#">Contact</a>
          </nav>
          <button className="primary-btn" onClick={() => navigate('/login')}>Connexion</button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <h1>
          Découvrez des Événements
          <span className="accent">Exceptionnels</span>
        </h1>
        <p>Vivez des expériences uniques avec notre plateforme de découverte et de réservation d'événements</p>

        <div className="filters">
          <button className="filter-pill"><Calendar size={14} /> <span>Cette semaine</span></button>
          <button className="filter-pill"><MapPin size={14} /> <span>Paris</span></button>
          <button className="filter-pill"><Music size={14} /> <span>Musique</span></button>
          <button className="filter-pill"><Utensils size={14} /> <span>Gastronomie</span></button>
        </div>
      </section>

      {/* Catégories Section */}
      <section className="section categories-section">
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Explorer</span>
            <h2>Catégories d'Événements</h2>
            <p>Découvrez des événements qui correspondent à vos passions</p>
          </div>
          
          <div className="categories-grid">
            {eventCategories.map((category, index) => (
              <div key={index} className="category-card">
                <div className="category-icon">
                  {category.icon}
                </div>
                <h3>{category.name}</h3>
                <p>{category.count}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Événements à Venir */}
    

      {/* About Section */}
      <section id="about" className="section about-section">
        <div className="container">
          <div className="about-content">
            <div className="about-text">
              <span className="section-subtitle">À propos de nous</span>
              <h2>Notre Passion pour les Événements</h2>
              <p>Depuis 2018, EventFinder connecte les passionnés aux événements les plus incroyables. Notre mission est de créer des expériences mémorables et de bâtir une communauté vibrante autour des arts, de la culture et du divertissement.</p>
              
              <div className="about-stats">
                <div className="stat-item">
                  <div className="stat-number">50K+</div>
                  <div className="stat-label">Participants</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">500+</div>
                  <div className="stat-label">Événements</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">15+</div>
                  <div className="stat-label">Villes</div>
                </div>
              </div>
              
              <button className="primary-btn">Découvrir notre histoire</button>
            </div>
            <div className="about-image">
              <div className="image-wrapper">
                <img src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" alt="Événement en cours" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="section services-section">
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Nos Services</span>
            <h2>Une Expérience Événementielle Complète</h2>
            <p>De la découverte à la participation, nous vous accompagnons à chaque étape</p>
          </div>
          
          <div className="services-grid">
            {services.map((service, index) => (
              <div key={index} className="service-card">
                <div className="service-icon-wrapper">
                  {service.icon}
                </div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section Équipe avec Carrousel */}
      <section className="section team-section">
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Notre Équipe</span>
            <h2>Rencontrez les Créateurs d'Événements</h2>
            <p>Une équipe passionnée qui donne vie à vos expériences</p>
          </div>
          
          <div className="carousel-container">
            <button 
              onClick={prevSlide}
              className="carousel-arrow prev"
              aria-label="Précédent"
            >
              &larr;
            </button>
            
            <div className="team-grid">
              {visibleMembers.map((member) => (
                <div key={member.name} className="team-card">
                  <div className="member-image">
                    <img src={member.image} alt={member.name} />
                  </div>
                  <div className="member-info">
                    <h3>{member.name}</h3>
                    <p>{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <button 
              onClick={nextSlide}
              className="carousel-arrow next"
              aria-label="Suivant"
            >
              &rarr;
            </button>
          </div>
          
          <div className="carousel-indicators">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`indicator ${currentSlide === index ? 'active' : ''}`}
                aria-label={`Aller à la page ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

   

      {/* Footer */}
      <footer className="site-footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-col footer-about">
              <div className="footer-logo">
                <Calendar size={24} />
                <span>EventFinder</span>
              </div>
              <p>Votre guide ultime pour découvrir et participer aux meilleurs événements culturels et divertissants.</p>
              <div className="footer-social">
                <a href="#" aria-label="Facebook"><Facebook size={18} /></a>
                <a href="#" aria-label="Twitter"><Twitter size={18} /></a>
                <a href="#" aria-label="Instagram"><Instagram size={18} /></a>
                <a href="#" aria-label="LinkedIn"><Linkedin size={18} /></a>
              </div>
            </div>
            
            <div className="footer-col">
              <h3>Navigation</h3>
              <ul>
                <li><a href="#">Accueil</a></li>
                <li><a href="#about">À propos</a></li>
                <li><a href="#services">Services</a></li>
                <li><a href="#team">Équipe</a></li>
                <li><a href="#">Contact</a></li>
              </ul>
            </div>
            
            <div className="footer-col">
              <h3>Catégories</h3>
              <ul>
                <li><a href="#">Musique</a></li>
                <li><a href="#">Art & Culture</a></li>
                <li><a href="#">Gastronomie</a></li>
                <li><a href="#">Business</a></li>
                <li><a href="#">Sport</a></li>
              </ul>
            </div>
            
            <div className="footer-col">
              <h3>Contact</h3>
              <ul className="contact-info">
                <li><Map size={16} /> 123 Avenue des Événements, 75008 Paris</li>
                <li><Mail size={16} /> contact@eventfinder.fr</li>
                <li><Phone size={16} /> +33 1 23 45 67 89</li>
              </ul>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} EventFinder. Tous droits réservés.</p>
            <div className="footer-links">
              <a href="#">Confidentialité</a>
              <a href="#">Conditions</a>
              <a href="#">Mentions légales</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}