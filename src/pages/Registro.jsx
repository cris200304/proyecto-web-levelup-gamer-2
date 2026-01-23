import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./registro.css";

export default function Registro() {
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    edad: "",
    psw: "",
    pswRepeat: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { nombre, email, edad, psw, pswRepeat } = form;

    if (edad < 18) {
      alert("Debes ser mayor o igual a 18 años para registrarte.");
      return;
    }

    //  Validación de contraseña
    //  Validación de 8 caracteres
    if (!/^(?=.*[A-Z])(?=.*\d)(?=.*[a-z]).{8,}$/.test(psw)) {
      alert(
        "La contraseña debe tener al menos 8 caracteres, una mayúscula y un número."
      );
      return;
    }

    if (psw !== pswRepeat) {
      alert("Las contraseñas no coinciden.");
      return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];

    if (users.some((u) => u.email === email)) {
      alert("El correo ya está registrado.");
      return;
    }

    const descuento = email.endsWith("@duocuc.cl") ? 0.2 : 0;

    const user = { nombre, email, edad, psw, descuento };

    users.push(user);
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("loggedUser", JSON.stringify(user));

    alert(`¡Registro exitoso! Bienvenido ${nombre}.`);
    navigate("/");
  };

  return (
    <div className="register-container">
      <form onSubmit={handleSubmit}>
        <h1>Crear Cuenta</h1>

        <label>Nombre</label>
        <input
          type="text"
          name="nombre"
          placeholder="Ingresa tu nombre"
          onChange={handleChange}
          required
        />

        <label>Correo</label>
        <input
          type="email"
          name="email"
          placeholder="Ingresa tu correo"
          onChange={handleChange}
          required
        />

        <label>Edad</label>
        <input
          type="number"
          name="edad"
          placeholder="Ingresa tu edad"
          onChange={handleChange}
          required
        />

        <label>Contraseña</label>
        <input
          type="password"
          name="psw"
          placeholder="Mínimo 8 caracteres, una mayúscula y un número"
          onChange={handleChange}
          required
        />

        <label>Repetir contraseña</label>
        <input
          type="password"
          name="pswRepeat"
          placeholder="Repite tu contraseña"
          onChange={handleChange}
          required
        />

        <button type="submit" className="registerbtn">
          Registrarse
        </button>
      </form>
    </div>
  );
}
