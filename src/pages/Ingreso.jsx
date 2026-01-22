import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ingreso.css";

export default function Ingreso() {
  const [form, setForm] = useState({ email: "", psw: "" });
  const [loggedUser, setLoggedUser] = useState(null);
  const navigate = useNavigate();

  // Al cargar, revisamos si hay un usuario logueado
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("loggedUser"));
    if (user) setLoggedUser(user);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = () => {
    const { email, psw } = form;

    if (!email || !psw) {
      alert("Por favor completa todos los campos.");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find((u) => u.email === email && u.psw === psw);

    if (!user) {
      alert(
        "Correo o contraseña incorrectos. Si no tienes cuenta, regístrate."
      );
      return;
    }

    // Guardar usuario logueado
    localStorage.setItem("loggedUser", JSON.stringify(user));
    setLoggedUser(user);
    alert(`¡Bienvenido ${user.nombre}!`);
    navigate("/"); // Redirige al inicio
  };

  const handleLogout = () => {
    localStorage.removeItem("loggedUser");
    setLoggedUser(null);
    alert("Has cerrado sesión.");
  };

  if (loggedUser) {
    return (
      <div className="login-container">
        <img src="Categoria_IMG/Logo_web/Logo.png" alt="logo_Ingreso" />
        <h1>Bienvenido, {loggedUser.nombre}!</h1>
        <button className="Registrar" onClick={handleLogout}>
          Cerrar Sesión
        </button>
      </div>
    );
  }

  return (
    <div className="login-container">
      <img src="Categoria_IMG/Logo_web/Logo.png" alt="logo_Ingreso" />
      <h1>Inicia Sesión</h1>

      <label htmlFor="email"><b>Correo</b></label>
      <input
        type="email"
        placeholder="Ingresa tu correo"
        name="email"
        id="email"
        value={form.email}
        onChange={handleChange}
        required
      />

      <label htmlFor="psw"><b>Contraseña</b></label>
      <input
        type="password"
        placeholder="Ingresa tu contraseña"
        name="psw"
        id="psw"
        value={form.psw}
        onChange={handleChange}
        required
      />

      <p>
        No cuentas con una cuenta? <a href="/registro">Regístrate aquí</a>.
      </p>

      <button className="Registrar" type="button" onClick={handleLogin}>
        Iniciar Sesión
      </button>
    </div>
  );
}
