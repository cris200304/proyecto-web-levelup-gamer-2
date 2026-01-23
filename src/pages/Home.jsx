
import React, { useState, useEffect, useRef } from "react";
import "./home.css";

// React Leaflet
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix iconos Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

export default function Home() {
  const [cart, setCart] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [successProducts, setSuccessProducts] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0); // Carrusel productos
  const [infoIndex, setInfoIndex] = useState(0);       // Carrusel información

  // 🔹 AGREGADO
  const [mapCenter, setMapCenter] = useState([-33.45, -70.66]);
  const [filtroCiudad, setFiltroCiudad] = useState("Todas");

  const carouselRef = useRef(null);
  const infoCarouselRef = useRef(null);

  // --- FUTUROS EVENTOS ---
  const eventos = [
    { nombre: "Valorant", fecha: "25 de Febrero 2026", lugar: "Santiago, Chile", coords: [-33.45, -70.66] },
    { nombre: "Elden Ring", fecha: "12 de Marzo 2026", lugar: "Valparaíso, Chile", coords: [-33.05, -71.62] },
    { nombre: "Fornite", fecha: "5 de Junio 2026", lugar: "Concepción, Chile", coords: [-36.82, -73.04] },
    { nombre: "Mario bros", fecha: "5 de Agosto 2026", lugar: "María Pinto, Chile", coords: [-33.45, -70.98] },
  ];

  // --- CARRUSEL PRODUCTOS ---
  const carruselProductos = [
    {
      nombre: "Juego Polilla Tramposa",
      descripcion: "Un divertido juego de cartas donde deberás engañar a tus rivales deshaciéndote de tus cartas sin que te descubran.",
      precio: "$16.999",
      img: "Categoria_IMG/Carrusel/PolillaTramposa.webp",
    },
    {
      nombre: "Basta!",
      descripcion: "El clásico juego de palabras para toda la familia, ideal para poner a prueba tu rapidez mental y vocabulario.",
      precio: "$10.000",
      img: "Categoria_IMG/Carrusel/Basta.webp",
    },
    {
      nombre: "Monopoly",
      descripcion: "Compra, vende y negocia propiedades en el juego de mesa más famoso del mundo. Estrategia y diversión aseguradas.",
      precio: "$19.999",
      img: "Categoria_IMG/Carrusel/Monopoly.webp",
    },
  ];

  // --- CARRUSEL INFORMACIÓN ---
  const carruselInformacion = [
    {
      nombre: "Valorant",
      descripcion: "Disfruta de los torneos de Valorant junto a tu equipo.",
      img: "Categoria_IMG/carrusel_Info/valorant.jpg",
      link: "https://valorantesports.com/es-MX/news/first-look-at-valorant-champions-tour-2026-",
    },
    {
      nombre: "Elden Ring",
      descripcion: "Aprende más sobre ELDEN RING y su nueva expansión.",
      img: "Categoria_IMG/carrusel_Info/elden ring.jpg",
      link: "https://www.eurogamer.es/10-cosas-que-deberias-hacer-nada-mas-empezar-elden-ring-shadow-of-erdtree",
    },
    {
      nombre: "Fornite",
      descripcion: "Disfruta esta nueva aventura en Fornite con la nueva colaboración con South Park junto a tus amigos.",
      img: "Categoria_IMG/carrusel_Info/Fornite_south.jpg",
      link: "https://www.fortnite.com/news?lang=es-ES",
    },
  ];

  // --- TOP EN VENTAS ---
  const productosDestacados = [
    { nombre: "Xbox Series X", descripcion: "Consola de última generación...", precio: "$599.999", img: "Categoria_IMG/Consolas/XboxSeriesX.webp" },
    { nombre: "PS5", descripcion: "Disfruta juegos exclusivos...", precio: "$633.000", img: "Categoria_IMG/Consolas/ps5.webp" },
    { nombre: "Control Xbox", descripcion: "Control ergonómico...", precio: "$60.000", img: "Categoria_IMG/Accesorios/controlXbox.webp" },
    { nombre: "Mando PS5", descripcion: "Control inalámbrico DualSense...", precio: "$29.999", img: "Categoria_IMG/Accesorios/mandoPs5.webp" },
    { nombre: "Audífonos HyperX", descripcion: "Sonido envolvente...", precio: "$20.000", img: "Categoria_IMG/Accesorios/hyperXaudifonos.webp" },
    { nombre: "Notebook Gaming OMEN", descripcion: "Computador ultimo modelo...", precio: "$2.599.990", img: "Categoria_IMG/Accesorios/NotevookHP.webp" },
    { nombre: "Silla Gamer Profesional Dragster GT500", descripcion: "Dragster GT500...", precio: "$170.000", img: "Categoria_IMG/Accesorios/sillagamer.webp" },
     { nombre: "Teclado Redragon Kumara", descripcion: "QWERTY Outemu Red...", precio: "$42.990", img: "Categoria_IMG/Accesorios/teclado.webp" },
  ];

  // --- Cargar carrito y cantidades ---
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);

    const initialQuantities = {};
    carruselProductos.forEach((p) => (initialQuantities[p.nombre] = 1));
    productosDestacados.forEach((p) => (initialQuantities[p.nombre] = 1));
    setQuantities(initialQuantities);
  }, []);

  const saveCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  const addToCart = (nombre, precio, img) => {
    const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
    if (!loggedUser) {
      alert("Debes estar registrado e iniciar sesión para agregar productos al carrito.");
      return;
    }

    const cantidad = quantities[nombre] || 1;
    const precioNum = Number(precio.replace(/\./g, "").replace("$", ""));
    const existing = cart.find((p) => p.nombre === nombre);

    const newCart = existing
      ? cart.map((p) =>
          p.nombre === nombre ? { ...p, cantidad: p.cantidad + cantidad } : p
        )
      : [...cart, { nombre, precio: precioNum, img, cantidad }];

    saveCart(newCart);

    setSuccessProducts((prev) => ({ ...prev, [nombre]: true }));
    setTimeout(() => {
      setSuccessProducts((prev) => ({ ...prev, [nombre]: false }));
    }, 3000);
  };

  const incrementLocal = (nombre) =>
    setQuantities({ ...quantities, [nombre]: (quantities[nombre] || 1) + 1 });

  const decrementLocal = (nombre) =>
    setQuantities({
      ...quantities,
      [nombre]: quantities[nombre] > 1 ? quantities[nombre] - 1 : 1,
    });

  // --- Carrusel Productos ---
  const nextSlide = () =>
    setCurrentIndex((prev) =>
      prev === carruselProductos.length - 1 ? 0 : prev + 1
    );

  const prevSlide = () =>
    setCurrentIndex((prev) =>
      prev === 0 ? carruselProductos.length - 1 : prev - 1
    );

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, []);

  // --- Carrusel Información ---
  const nextInfo = () =>
    setInfoIndex((prev) =>
      prev === carruselInformacion.length - 1 ? 0 : prev + 1
    );

  const prevInfo = () =>
    setInfoIndex((prev) =>
      prev === 0 ? carruselInformacion.length - 1 : prev - 1
    );

  useEffect(() => {
    const interval = setInterval(nextInfo, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* --- CARRUSEL PRODUCTOS --- */}
      <section className="carruselVentas">
        <div className="carousel">
          <div
            className="carousel-track"
            style={{
              transform: `translateX(-${currentIndex * 100}%)`,
              transition: "transform 0.5s ease-in-out",
              display: "flex",
            }}
            ref={carouselRef}
          >
            {carruselProductos.map((prod, index) => (
              <article className="carousel-slide" key={index} style={{ minWidth: "100%" }}>
                <img src={prod.img} alt={prod.nombre} className="carousel-image" />
                <div className="carousel-content">
                  <h2 className="game-title">{prod.nombre}</h2>
                  <p className="descripcion">{prod.descripcion}</p>
                  <p className="game-price">{prod.precio}</p>

                  <div className="cart-buttons">
                    <div className="quantity-controls">
                      <button onClick={() => decrementLocal(prod.nombre)}>-</button>
                      <span>{quantities[prod.nombre] || 1}</span>
                      <button onClick={() => incrementLocal(prod.nombre)}>+</button>
                    </div>
                    <button
                      className="btn-carrito"
                      onClick={() => addToCart(prod.nombre, prod.precio, prod.img)}
                    >
                      Agregar al carrito
                    </button>
                  </div>

                  {successProducts[prod.nombre] && (
                    <div className="success-message">
                      Producto "{prod.nombre}" agregado con éxito
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>

          <button className="carousel-btn prev" onClick={prevSlide}>
            &#10094;
          </button>
          <button className="carousel-btn next" onClick={nextSlide}>
            &#10095;
          </button>
        </div>
      </section>

      {/* --- TOP EN VENTAS --- */}
      <section className="lomasVendido">
        <h1>TOP EN VENTAS 2026</h1>

        <div className="productos-grid">
          {productosDestacados.map((prod, index) => (
            <article className="producto" key={index}>
              <img src={prod.img} alt={prod.nombre} />
              <h3>{prod.nombre}</h3>
              <p className="descripcion">{prod.descripcion}</p>
              <p className="precio">{prod.precio}</p>

              <div className="cart-buttons">
                <div className="quantity-controls">
                  <button onClick={() => decrementLocal(prod.nombre)}>-</button>
                  <span>{quantities[prod.nombre]}</span>
                  <button onClick={() => incrementLocal(prod.nombre)}>+</button>
                </div>

                <button
                  className="btn-carrito"
                  onClick={() => addToCart(prod.nombre, prod.precio, prod.img)}
                >
                  Agregar al carrito
                </button>
              </div>

              {/* ✅ MENSAJE AGREGADO */}
              {successProducts[prod.nombre] && (
                <div className="success-message">
                  Producto "{prod.nombre}" agregado con éxito!
                </div>
              )}
            </article>
          ))}
        </div>
      </section>

      {/* --- PRÓXIMOS EVENTOS + MAPA --- */}
      <section className="futuros-eventos">
        <h3>FUTUROS EVENTOS</h3>

        <select
          className="filtro-ciudad"
          value={filtroCiudad}
          onChange={(e) => setFiltroCiudad(e.target.value)}
        >
          <option value="Todas">Todas las ciudades</option>
          {[...new Set(eventos.map((e) => e.lugar))].map((c, i) => (
            <option key={i} value={c}>
              {c}
            </option>
          ))}
        </select>

        <div className="eventos-grid">
          {eventos
            .filter((e) => filtroCiudad === "Todas" || e.lugar === filtroCiudad)
            .map((e, i) => (
              <div className="evento" key={i}>
                <h4>{e.nombre}</h4>
                <p>
                  <strong>Fecha:</strong> {e.fecha}
                </p>
                <p>
                  <strong>Lugar:</strong> {e.lugar}
                </p>

                <button className="btn-mapa" onClick={() => setMapCenter(e.coords)}>
                  Ver en mapa
                </button>
              </div>
            ))}
        </div>

        <h3 className="titulo-centrado">BUSCA TU PRÓXIMA AVENTURA</h3>

        <div className="map-container">
          <MapContainer center={mapCenter} zoom={6} style={{ height: "400px", width: "100%" }} key={mapCenter.toString()}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />
            {eventos.map((e, i) => (
              <Marker key={i} position={e.coords}>
                <Popup>
                  <b>{e.nombre}</b>
                  <br />
                  {e.fecha}
                  <br />
                  {e.lugar}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </section>

      {/* --- CARRUSEL INFORMACIÓN --- */}
      <section className="carruselInformacion">
        <div className="carousel">
          <div
            className="carousel-track"
            style={{
              transform: `translateX(-${infoIndex * 100}%)`,
              transition: "transform 0.5s ease-in-out",
              display: "flex",
            }}
            ref={infoCarouselRef}
          >
            {carruselInformacion.map((info, index) => (
              <article className="carousel-slide" key={index} style={{ minWidth: "100%" }}>
                <img src={info.img} alt={info.nombre} className="carousel_info" />
                <div className="carousel-content">
                  <h2 className="game-title">{info.nombre}</h2>
                  <p className="descripcion">{info.descripcion}</p>
                  <a href={info.link} target="_blank" className="btn-carrito">
                    Más información
                  </a>
                </div>
              </article>
            ))}
          </div>

          <button className="carousel-btn prev" onClick={prevInfo}>
            &#10094;
          </button>
          <button className="carousel-btn next" onClick={nextInfo}>
            &#10095;
          </button>
        </div>
      </section>


     {/* FOOTER */}
      <footer>
        <p>
          ¡Desafía tus límites con Level-Up Gamer!
          <br />
          Explora, juega y gana con nosotros.
        </p>
      </footer>
    </>
  );
}
=======
import React, { useState, useEffect, useRef } from "react";
import "./home.css";

// React Leaflet
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix iconos Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

export default function Home() {
  const [cart, setCart] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [successProducts, setSuccessProducts] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0); // Carrusel productos
  const [infoIndex, setInfoIndex] = useState(0);       // Carrusel información

  // 🔹 AGREGADO
  const [mapCenter, setMapCenter] = useState([-33.45, -70.66]);
  const [filtroCiudad, setFiltroCiudad] = useState("Todas");

  const carouselRef = useRef(null);
  const infoCarouselRef = useRef(null);

  // --- FUTUROS EVENTOS ---
  const eventos = [
    { nombre: "Valorant", fecha: "25 de Febrero 2026", lugar: "Santiago, Chile", coords: [-33.45, -70.66] },
    { nombre: "Elden Ring", fecha: "12 de Marzo 2026", lugar: "Valparaíso, Chile", coords: [-33.05, -71.62] },
    { nombre: "Fornite", fecha: "5 de Junio 2026", lugar: "Concepción, Chile", coords: [-36.82, -73.04] },
    { nombre: "Mario bros", fecha: "5 de Agosto 2026", lugar: "María Pinto, Chile", coords: [-33.45, -70.98] },
  ];

  // --- CARRUSEL PRODUCTOS ---
  const carruselProductos = [
    {
      nombre: "Juego Polilla Tramposa",
      descripcion: "Un divertido juego de cartas donde deberás engañar a tus rivales deshaciéndote de tus cartas sin que te descubran.",
      precio: "$16.999",
      img: "Categoria_IMG/Carrusel/PolillaTramposa.webp",
    },
    {
      nombre: "Basta!",
      descripcion: "El clásico juego de palabras para toda la familia, ideal para poner a prueba tu rapidez mental y vocabulario.",
      precio: "$10.000",
      img: "Categoria_IMG/Carrusel/Basta.webp",
    },
    {
      nombre: "Monopoly",
      descripcion: "Compra, vende y negocia propiedades en el juego de mesa más famoso del mundo. Estrategia y diversión aseguradas.",
      precio: "$19.999",
      img: "Categoria_IMG/Carrusel/Monopoly.webp",
    },
  ];

  // --- CARRUSEL INFORMACIÓN ---
  const carruselInformacion = [
    {
      nombre: "Valorant",
      descripcion: "Disfruta de los torneos de Valorant junto a tu equipo.",
      img: "Categoria_IMG/carrusel_Info/valorant.jpg",
      link: "https://valorantesports.com/es-MX/news/first-look-at-valorant-champions-tour-2026-",
    },
    {
      nombre: "Elden Ring",
      descripcion: "Aprende más sobre ELDEN RING y su nueva expansión.",
      img: "Categoria_IMG/carrusel_Info/elden ring.jpg",
      link: "https://www.eurogamer.es/10-cosas-que-deberias-hacer-nada-mas-empezar-elden-ring-shadow-of-erdtree",
    },
    {
      nombre: "Fornite",
      descripcion: "Disfruta esta nueva aventura en Fornite con la nueva colaboración con South Park junto a tus amigos.",
      img: "Categoria_IMG/carrusel_Info/Fornite_south.jpg",
      link: "https://www.fortnite.com/news?lang=es-ES",
    },
  ];

  // --- TOP EN VENTAS ---
  const productosDestacados = [
    { nombre: "Xbox Series X", descripcion: "Consola de última generación...", precio: "$599.999", img: "Categoria_IMG/Consolas/XboxSeriesX.webp" },
    { nombre: "PS5", descripcion: "Disfruta juegos exclusivos...", precio: "$633.000", img: "Categoria_IMG/Consolas/ps5.webp" },
    { nombre: "Control Xbox", descripcion: "Control ergonómico...", precio: "$60.000", img: "Categoria_IMG/Accesorios/controlXbox.webp" },
    { nombre: "Mando PS5", descripcion: "Control inalámbrico DualSense...", precio: "$29.999", img: "Categoria_IMG/Accesorios/mandoPs5.webp" },
    { nombre: "Audífonos HyperX", descripcion: "Sonido envolvente...", precio: "$20.000", img: "Categoria_IMG/Accesorios/hyperXaudifonos.webp" },
    { nombre: "Notebook Gaming OMEN", descripcion: "Computador ultimo modelo...", precio: "$2.599.990", img: "Categoria_IMG/Accesorios/NotevookHP.webp" },
    { nombre: "Silla Gamer Profesional Dragster GT500", descripcion: "Dragster GT500...", precio: "$170.000", img: "Categoria_IMG/Accesorios/sillagamer.webp" },
     { nombre: "Teclado Redragon Kumara", descripcion: "QWERTY Outemu Red...", precio: "$42.990", img: "Categoria_IMG/Accesorios/teclado.webp" },
  ];

  // --- Cargar carrito y cantidades ---
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);

    const initialQuantities = {};
    carruselProductos.forEach((p) => (initialQuantities[p.nombre] = 1));
    productosDestacados.forEach((p) => (initialQuantities[p.nombre] = 1));
    setQuantities(initialQuantities);
  }, []);

  const saveCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  const addToCart = (nombre, precio, img) => {
    const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
    if (!loggedUser) {
      alert("Debes estar registrado e iniciar sesión para agregar productos al carrito.");
      return;
    }

    const cantidad = quantities[nombre] || 1;
    const precioNum = Number(precio.replace(/\./g, "").replace("$", ""));
    const existing = cart.find((p) => p.nombre === nombre);

    const newCart = existing
      ? cart.map((p) =>
          p.nombre === nombre ? { ...p, cantidad: p.cantidad + cantidad } : p
        )
      : [...cart, { nombre, precio: precioNum, img, cantidad }];

    saveCart(newCart);

    setSuccessProducts((prev) => ({ ...prev, [nombre]: true }));
    setTimeout(() => {
      setSuccessProducts((prev) => ({ ...prev, [nombre]: false }));
    }, 3000);
  };

  const incrementLocal = (nombre) =>
    setQuantities({ ...quantities, [nombre]: (quantities[nombre] || 1) + 1 });

  const decrementLocal = (nombre) =>
    setQuantities({
      ...quantities,
      [nombre]: quantities[nombre] > 1 ? quantities[nombre] - 1 : 1,
    });

  // --- Carrusel Productos ---
  const nextSlide = () =>
    setCurrentIndex((prev) =>
      prev === carruselProductos.length - 1 ? 0 : prev + 1
    );

  const prevSlide = () =>
    setCurrentIndex((prev) =>
      prev === 0 ? carruselProductos.length - 1 : prev - 1
    );

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, []);

  // --- Carrusel Información ---
  const nextInfo = () =>
    setInfoIndex((prev) =>
      prev === carruselInformacion.length - 1 ? 0 : prev + 1
    );

  const prevInfo = () =>
    setInfoIndex((prev) =>
      prev === 0 ? carruselInformacion.length - 1 : prev - 1
    );

  useEffect(() => {
    const interval = setInterval(nextInfo, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* --- CARRUSEL PRODUCTOS --- */}
      <section className="carruselVentas">
        <div className="carousel">
          <div
            className="carousel-track"
            style={{
              transform: `translateX(-${currentIndex * 100}%)`,
              transition: "transform 0.5s ease-in-out",
              display: "flex",
            }}
            ref={carouselRef}
          >
            {carruselProductos.map((prod, index) => (
              <article className="carousel-slide" key={index} style={{ minWidth: "100%" }}>
                <img src={prod.img} alt={prod.nombre} className="carousel-image" />
                <div className="carousel-content">
                  <h2 className="game-title">{prod.nombre}</h2>
                  <p className="descripcion">{prod.descripcion}</p>
                  <p className="game-price">{prod.precio}</p>

                  <div className="cart-buttons">
                    <div className="quantity-controls">
                      <button onClick={() => decrementLocal(prod.nombre)}>-</button>
                      <span>{quantities[prod.nombre] || 1}</span>
                      <button onClick={() => incrementLocal(prod.nombre)}>+</button>
                    </div>
                    <button
                      className="btn-carrito"
                      onClick={() => addToCart(prod.nombre, prod.precio, prod.img)}
                    >
                      Agregar al carrito
                    </button>
                  </div>

                  {successProducts[prod.nombre] && (
                    <div className="success-message">
                      Producto "{prod.nombre}" agregado con éxito
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>

          <button className="carousel-btn prev" onClick={prevSlide}>
            &#10094;
          </button>
          <button className="carousel-btn next" onClick={nextSlide}>
            &#10095;
          </button>
        </div>
      </section>

      {/* --- TOP EN VENTAS --- */}
      <section className="lomasVendido">
        <h1>TOP EN VENTAS 2026</h1>

        <div className="productos-grid">
          {productosDestacados.map((prod, index) => (
            <article className="producto" key={index}>
              <img src={prod.img} alt={prod.nombre} />
              <h3>{prod.nombre}</h3>
              <p className="descripcion">{prod.descripcion}</p>
              <p className="precio">{prod.precio}</p>

              <div className="cart-buttons">
                <div className="quantity-controls">
                  <button onClick={() => decrementLocal(prod.nombre)}>-</button>
                  <span>{quantities[prod.nombre]}</span>
                  <button onClick={() => incrementLocal(prod.nombre)}>+</button>
                </div>

                <button
                  className="btn-carrito"
                  onClick={() => addToCart(prod.nombre, prod.precio, prod.img)}
                >
                  Agregar al carrito
                </button>
              </div>

              {/* ✅ MENSAJE AGREGADO */}
              {successProducts[prod.nombre] && (
                <div className="success-message">
                  Producto "{prod.nombre}" agregado con éxito!
                </div>
              )}
            </article>
          ))}
        </div>
      </section>

      {/* --- PRÓXIMOS EVENTOS + MAPA --- */}
      <section className="futuros-eventos">
        <h3>FUTUROS EVENTOS</h3>

        <select
          className="filtro-ciudad"
          value={filtroCiudad}
          onChange={(e) => setFiltroCiudad(e.target.value)}
        >
          <option value="Todas">Todas las ciudades</option>
          {[...new Set(eventos.map((e) => e.lugar))].map((c, i) => (
            <option key={i} value={c}>
              {c}
            </option>
          ))}
        </select>

        <div className="eventos-grid">
          {eventos
            .filter((e) => filtroCiudad === "Todas" || e.lugar === filtroCiudad)
            .map((e, i) => (
              <div className="evento" key={i}>
                <h4>{e.nombre}</h4>
                <p>
                  <strong>Fecha:</strong> {e.fecha}
                </p>
                <p>
                  <strong>Lugar:</strong> {e.lugar}
                </p>

                <button className="btn-mapa" onClick={() => setMapCenter(e.coords)}>
                  Ver en mapa
                </button>
              </div>
            ))}
        </div>

        <h3 className="titulo-centrado">BUSCA TU PRÓXIMA AVENTURA</h3>

        <div className="map-container">
          <MapContainer center={mapCenter} zoom={6} style={{ height: "400px", width: "100%" }} key={mapCenter.toString()}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />
            {eventos.map((e, i) => (
              <Marker key={i} position={e.coords}>
                <Popup>
                  <b>{e.nombre}</b>
                  <br />
                  {e.fecha}
                  <br />
                  {e.lugar}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </section>

      {/* --- CARRUSEL INFORMACIÓN --- */}
      <section className="carruselInformacion">
        <div className="carousel">
          <div
            className="carousel-track"
            style={{
              transform: `translateX(-${infoIndex * 100}%)`,
              transition: "transform 0.5s ease-in-out",
              display: "flex",
            }}
            ref={infoCarouselRef}
          >
            {carruselInformacion.map((info, index) => (
              <article className="carousel-slide" key={index} style={{ minWidth: "100%" }}>
                <img src={info.img} alt={info.nombre} className="carousel_info" />
                <div className="carousel-content">
                  <h2 className="game-title">{info.nombre}</h2>
                  <p className="descripcion">{info.descripcion}</p>
                  <a href={info.link} target="_blank" className="btn-carrito">
                    Más información
                  </a>
                </div>
              </article>
            ))}
          </div>

          <button className="carousel-btn prev" onClick={prevInfo}>
            &#10094;
          </button>
          <button className="carousel-btn next" onClick={nextInfo}>
            &#10095;
          </button>
        </div>
      </section>


     {/* FOOTER */}
      <footer>
        <p>
          ¡Desafía tus límites con Level-Up Gamer!
          <br />
          Explora, juega y gana con nosotros.
        </p>
      </footer>
    </>
  );
}

