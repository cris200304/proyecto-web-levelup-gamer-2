import { useEffect, useState } from "react";
import "./carrito.css";

export default function Carrito() {
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);

  // 🔹 Cargar usuario y carrito
  useEffect(() => {
    const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));

    // 👉 Si no hay usuario logueado → borrar carrito
    if (!loggedUser) {
      setCart([]);
      localStorage.removeItem("cart");
      return;
    }

    setUser({
      ...loggedUser,
      descuento: Number(loggedUser.descuento) || 0,
    });

    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);
  }, []);

  // 🔹 Guardar carrito automáticamente
  useEffect(() => {
    if (user) {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart, user]);

  // 🔹 Calcular total sin descuento
  const calcularTotal = () => {
    return cart.reduce(
      (total, producto) => total + producto.precio * producto.cantidad,
      0
    );
  };

  // 🔹 Calcular total con descuento
  const calcularTotalConDescuento = () => {
    const total = calcularTotal();
    return total - total * (user?.descuento || 0);
  };

  // 🔹 Aumentar cantidad
  const aumentarCantidad = (index) => {
    const nuevoCarrito = [...cart];
    nuevoCarrito[index].cantidad += 1;
    setCart(nuevoCarrito);
  };

  // 🔹 Disminuir cantidad
  const disminuirCantidad = (index) => {
    const nuevoCarrito = [...cart];

    if (nuevoCarrito[index].cantidad > 1) {
      nuevoCarrito[index].cantidad -= 1;
    } else {
      nuevoCarrito.splice(index, 1); // eliminar producto
    }

    setCart(nuevoCarrito);
  };

  // 🔹 Pagar
  const pagar = () => {
    alert("¡Gracias por tu compra! 🎮");
    setCart([]);
    localStorage.removeItem("cart");
  };

  return (
    <>
      {/* CARRITO */}
      <section className="carrito-container">
        {cart.length === 0 ? (
          <p style={{ textAlign: "center", fontSize: "1.3rem", color: "#ccc" }}>
            El carrito está vacío
          </p>
        ) : (
          cart.map((producto, index) => (
            <div className="producto-carrito" key={index}>
              <img src={producto.img} alt={producto.nombre} />
              <h3>{producto.nombre}</h3>

              <p>Precio unitario: ${producto.precio.toLocaleString()}</p>

              {/* CONTROLES */}
              <div className="quantity-controls">
                <button onClick={() => disminuirCantidad(index)}>-</button>
                <span>{producto.cantidad}</span>
                <button onClick={() => aumentarCantidad(index)}>+</button>
              </div>

              <p>
                <strong>Subtotal:</strong>{" "}
                ${(producto.precio * producto.cantidad).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </section>

      {/* TOTAL */}
      <div className="pagar-container">
        {cart.length > 0 && (
          <>
            <div className="total-compra">
              Total: ${calcularTotal().toLocaleString()}
            </div>

            {user?.descuento > 0 && (
              <div className="descuento-duoc">
                🎓 Descuento DUOC ({user.descuento * 100}%): -$
                {(calcularTotal() * user.descuento).toLocaleString()}
              </div>
            )}

            <div className="total-final">
              <strong>
                Total a pagar: $
                {calcularTotalConDescuento().toLocaleString()}
              </strong>
            </div>
          </>
        )}

        <button
          className="btn-pagar"
          onClick={pagar}
          disabled={cart.length === 0}
          style={{ opacity: cart.length === 0 ? 0.5 : 1 }}
        >
          Pagar
        </button>
      </div>

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
