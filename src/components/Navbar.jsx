import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import './navbar.css';

export default function Navbar() {
  const [hideNav, setHideNav] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    // Manejo del scroll para ocultar / mostrar navbar
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setHideNav(true); // bajar -> ocultar
      } else {
        setHideNav(false); // subir -> mostrar
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    // Animación del logo al hacer clic
    const logo = document.querySelector('.logo-navbar');
    if (!logo) return;

    const handleClick = () => {
      logo.classList.add('spin');
      setTimeout(() => {
        logo.classList.remove('spin');
      }, 600);
    };

    logo.addEventListener('click', handleClick);
    return () => logo.removeEventListener('click', handleClick);
  }, []);

  return (
    <nav className={`navbar navbar-expand-lg navbar-dark ${hideNav ? 'hide' : ''}`}>
      <div className="container">
        {/* Logo + Nombre */}
        <NavLink to="/" className="navbar-brand d-flex align-items-center">
          <img
            src="Categoria_IMG/Logo_web/Logo.png"
            alt="logo"
            className="logo-navbar"
          />
          <span className="ms-2">Level-up Games</span>
        </NavLink>

        {/* Botón responsive */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Links */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <NavLink to="/" className="nav-link">Inicio</NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/ingreso" className="nav-link">Ingreso</NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/productos" className="nav-link">Productos</NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/carrito" className="nav-link">Carrito</NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
