import React, { useEffect, useState } from "react";

export default function Productos() {
  const [cart, setCart] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [successProducts, setSuccessProducts] = useState({}); // Para mensajes por producto

  const productos = [
    { nombre: "Xbox Series X", descripcion: "Consola de última generación...", precio: "$599.999", img: "Categoria_IMG/Consolas/XboxSeriesX.webp" },
    // { nombre: "PS5", descripcion: "Disfruta juegos exclusivos...", precio: "$633.000", img: "Categoria_IMG/Consolas/ps5.webp" },
    //{ nombre: "Control Xbox", descripcion: "Control ergonómico...", precio: "$60.000", img: "Categoria_IMG/Accesorios/controlXbox.webp" },
    { nombre: "Mando PS5", descripcion: "Control inalámbrico DualSense...", precio: "$29.999", img: "Categoria_IMG/Accesorios/mandoPs5.webp" },
    { nombre: "Audífonos HyperX", descripcion: "Sonido envolvente...", precio: "$20.000", img: "Categoria_IMG/Accesorios/hyperXaudifonos.webp" },
    { nombre: "MousePad", descripcion: "Superficie cómoda para la muñeca...", precio: "$16.000", img: "Categoria_IMG/Accesorios/mausePadGM.webp" },
    { nombre: "Mouse GAMER", descripcion: "Precisión increíble para largas horas de juego...", precio: "$16.000", img: "Categoria_IMG/Accesorios/mausGm.webp" },
    { nombre: "Notebook Gaming OMEN", descripcion: "Computador ultimo modelo...", precio: "$2.599.990", img: "Categoria_IMG/Accesorios/NotevookHP.webp" },
    { nombre: "Silla Gamer Profesional Dragster GT500", descripcion: "Dragster GT500...", precio: "$170.000", img: "Categoria_IMG/Accesorios/sillagamer.webp" },
     { nombre: "Teclado Redragon Kumara", descripcion: "QWERTY Outemu Red...", precio: "$42.990", img: "Categoria_IMG/Accesorios/teclado.webp" },

  ];

  // Cargar carrito desde localStorage y cantidades iniciales
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);

    const initialQuantities = {};
    productos.forEach((p) => {
      initialQuantities[p.nombre] = 1;
    });
    setQuantities(initialQuantities);
  }, []);

  const saveCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  // Agregar producto al carrito con validación de usuario
  const addToCart = (nombre, precio, img) => {
    const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
    if (!loggedUser) {
      alert("Debes estar registrado e iniciar sesión para agregar productos al carrito.");
      return;
    }

    const cantidad = quantities[nombre] || 1;
    const precioNum = Number(precio.replace(/\./g, "").replace("$", ""));
    const existing = cart.find((p) => p.nombre === nombre);

    let newCart;
    if (existing) {
      newCart = cart.map((p) =>
        p.nombre === nombre ? { ...p, cantidad: p.cantidad + cantidad } : p
      );
    } else {
      newCart = [...cart, { nombre, precio: precioNum, img, cantidad }];
    }

    saveCart(newCart);

    // Mostrar mensaje temporal solo para este producto
    setSuccessProducts((prev) => ({ ...prev, [nombre]: true }));
    setTimeout(() => {
      setSuccessProducts((prev) => ({ ...prev, [nombre]: false }));
    }, 3000);
  };

  // Manejar cantidad local antes de agregar
  const incrementLocal = (nombre) => {
    setQuantities({
      ...quantities,
      [nombre]: (quantities[nombre] || 1) + 1,
    });
  };

  const decrementLocal = (nombre) => {
    setQuantities({
      ...quantities,
      [nombre]: quantities[nombre] > 1 ? quantities[nombre] - 1 : 1,
    });
  };

  return (
    <section className="lomasVendido">
      <h1>Productos a la venta</h1>

      <div className="productos-grid">
        {productos.map((prod, index) => {
          return (
            <article className="producto" key={index}>
              <img src={prod.img} alt={prod.nombre} />
              <h3>{prod.nombre}</h3>
              <p className="descripcion">{prod.descripcion}</p>
              <p className="precio">{prod.precio}</p>

              {/* Controles de cantidad antes de agregar */}
              <div className="cart-buttons">
                <div className="quantity-controls">
                  <button onClick={() => decrementLocal(prod.nombre)}>-</button>
                  <span>{quantities[prod.nombre] || 1}</span>
                  <button onClick={() => incrementLocal(prod.nombre)}>+</button>
                </div>

                {/* Botón agregar */}
                <button
                  className="btn-carrito"
                  onClick={() => addToCart(prod.nombre, prod.precio, prod.img)}
                >
                  Agregar al carrito
                </button>
              </div>

              {/* Mensaje de éxito solo para este producto */}
              {successProducts[prod.nombre] && (
                <div className="success-message">
                  Producto "{prod.nombre}" agregado con éxito
                </div>
              )}
            </article>
          );
        })}
        
      </div>
      <footer>
        <p>
          ¡Desafía tus límites con Level-Up Gamer!
          <br />
          Explora, juega y gana con nosotros.
        </p>
      </footer>
    </section>
    
  );
}
