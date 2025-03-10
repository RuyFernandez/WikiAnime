import { Link, useNavigate } from "react-router-dom";
import { useState, useContext, useEffect } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import { FiSun, FiMoon, FiSearch, FiMenu, FiX } from "react-icons/fi";
import { RiFilmFill } from "react-icons/ri";
import { FaBookOpen } from "react-icons/fa";
import { MdShuffle, MdRecommend } from "react-icons/md";
import '../../Styles/Header.css';

export default function Header({ searchValue, setSearchValue }) {
  const [inputValue, setInputValue] = useState(searchValue || "");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useContext(ThemeContext);

  if (setSearchValue === null) {
    setSearchValue = () => {};
  }

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const handleSearch = () => {
    if (inputValue.trim() === "") return;

    setSearchValue(inputValue);

    navigate("/");

    setInputValue("");
    setMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  // Cerrar el menú al cambiar de tamaño de pantalla
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 770) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <header>
      <div className="header-mobile-container">
        <button 
          className="mobile-menu-button"
          onClick={toggleMobileMenu}
          aria-label={mobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <FiX className="mobile-menu-icon" /> : <FiMenu className="mobile-menu-icon" />}
        </button>
        
        <a href="/" className="logo-link">
          <img src="/Logo.png" alt="Logo" className="logo-image" />
        </a>

        <button
          onClick={toggleTheme}
          className="theme-toggle mobile-theme-toggle"
          aria-label={`Cambiar a modo ${theme === "light" ? "oscuro" : "claro"}`}
        >
          {theme === "light" ? <FiMoon className="theme-icon" /> : <FiSun className="theme-icon" />}
        </button>
      </div>
      
      {mobileMenuOpen && (
        <div className="mobile-menu">
          <div className="mobile-nav-links">
            <Link to="/anime/filter" className="nav-link" onClick={closeMobileMenu}>
              <RiFilmFill className="nav-icon" />
              <span>Anime</span>
            </Link>
            <Link to="/manga/filter" className="nav-link" onClick={closeMobileMenu}>
              <FaBookOpen className="nav-icon" />
              <span>Manga</span>
            </Link>
            <Link to="/random" className="nav-link" onClick={closeMobileMenu}>
              <MdShuffle className="nav-icon" />
              <span>Random</span>
            </Link>
            <Link to="/recommendations" className="nav-link" onClick={closeMobileMenu}>
              <MdRecommend className="nav-icon" />
              <span>Recomendados</span>
            </Link>
          </div>
          
          <div className="mobile-search">
            <div className="search-input-wrapper">
              <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Search anime or manga..."
                className="search-input"
                aria-label="Buscar anime o manga"
              />
              <button 
                onClick={handleSearch} 
                className="search-button"
                aria-label="Buscar"
              >
                <FiSearch className="search-icon" />
                <span>Buscar</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="elements desktop-elements">
        <Link to="/anime/filter" className="nav-link">
          <RiFilmFill className="nav-icon" />
          <span>Anime</span>
        </Link>
        <Link to="/manga/filter" className="nav-link">
          <FaBookOpen className="nav-icon" />
          <span>Manga</span>
        </Link>
        <Link to="/random" className="nav-link">
          <MdShuffle className="nav-icon" />
          <span>Random</span>
        </Link>
        <Link to="/recommendations" className="nav-link">
          <MdRecommend className="nav-icon" />
          <span>Recomendados</span>
        </Link>
      </div>

      <a href="/" className="logo-link desktop-logo">
        <img src="/Logo.png" alt="Logo" className="logo-image" />
      </a>

      <div className="search-container desktop-search">
        <div className="search-input-wrapper">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Search anime or manga..."
            className="search-input"
            aria-label="Buscar anime o manga"
          />
          <button 
            onClick={handleSearch} 
            className="search-button"
            aria-label="Buscar"
          >
            <FiSearch className="search-icon" />
          </button>
        </div>
        <button
          onClick={toggleTheme}
          className="theme-toggle"
          aria-label={`Cambiar a modo ${
            theme === "light" ? "oscuro" : "claro"
          }`}
          title={`Cambiar a modo ${theme === "light" ? "oscuro" : "claro"}`}
        >
          {theme === "light" ? <FiMoon className="theme-icon" /> : <FiSun className="theme-icon" />}
        </button>
      </div>
    </header>
  );
}
