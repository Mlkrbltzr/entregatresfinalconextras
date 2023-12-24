//scripts.js
// Conectar al servidor de socket.io
const socket = io();

// Manejar evento de conexión establecida
socket.on('conexion-establecida', (mensaje) => {
  console.log('Mensaje del servidor:', mensaje);
});

// Manejar evento de nuevo producto
socket.on('newProduct', (data) => {
  console.log(data);
  const productsElements = document.getElementById("products");
  console.log(productsElements);
  const productElement = document.createElement('li');
  productElement.innerHTML = `${data.title} - ${data.description}`;
  productsElements.appendChild(productElement);
});

// Manejar evento de eliminar producto
socket.on('deleteProduct', (id) => {
  console.log(id);
  const productElement = document.getElementById(id).remove();
  console.log(productElement);
});

// Esperar a que el DOM esté completamente cargado
document.addEventListener("DOMContentLoaded", () => {
  // Obtener botones de detalle
  const detalleButtons = document.querySelectorAll(".detalle-button");
  detalleButtons.forEach((button) => {
    // Agregar evento click a los botones de detalle
    button.addEventListener("click", (event) => {
      const productId = event.currentTarget.dataset.productId;
      window.location.href = `/product/${productId}`;
    });
  });

  // Obtener botón de carrito
  const carritoBtn = document.getElementById("carrito-compra");

  // Función asíncrona para obtener el ID del carrito del usuario
  async function obtenerIdCarrito() {
    try {
      const userResponse = await fetch("/api/carts/getusercart", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        }
      });

      if (userResponse.ok) {
        const userData = await userResponse.json();
        return userData.cartId;
      } else {
        const errorData = await userResponse.json();
        console.error('No se pudo obtener el ID del carrito:', errorData);
        return null;
      }
    } catch (error) {
      console.error('Error al obtener el ID del carrito:', error);
      return null;
    }
  }

  // Agregar evento click al botón de carrito
  if (carritoBtn) {
    carritoBtn.addEventListener("click", async () => {
      try {
        const carritoId = await obtenerIdCarrito();
        if (carritoId) {
          window.location.href = `/cart/detail/${carritoId}`;
        } else {
          console.error("No se pudo obtener el ID del carrito.");
        }
      } catch (error) {
        console.error("Error al obtener el ID del carrito:", error);
      }
    });
  }

  // Obtener formulario de registro
  const formulario = document.getElementById("messageForm");

  // Agregar evento submit al formulario de registro
  if (formulario) {
    formulario.addEventListener("submit", async (e) => {
      e.preventDefault();

      const nombre = document.getElementById("nombre").value;
      const apellido = document.getElementById("apellido").value;
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      const message = document.getElementById("message").value;

      // Verificar si el campo de mensaje está vacío
      const datos = { nombre, apellido, email, password, message };

      // Enviar los datos del formulario
      try {
        const response = await fetch("/Register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(datos)
        });

        if (response.ok) {
          alert("Usuario y mensaje guardados con éxito");
          formulario.reset();
        } else {
          if (response.status === 400) {
            alert("El correo ya está registrado");
          } else {
            alert("Error al guardar el usuario y el mensaje");
          }
        }
      } catch (error) {
        console.error(error);
        alert("Error al registrarse");
      }
    });
  }

  // ... (otros eventos y código)

  // Manejar evento de reset de contraseña
  const resetPasswordForm = document.getElementById("resetPasswordForm");
  if (resetPasswordForm) {
    resetPasswordForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const email = document.getElementById("email").value;
      const newPassword = document.getElementById("newPassword").value;
      const confirmPassword = document.getElementById("confirmPassword").value;

      // Verificar si las contraseñas coinciden
      if (newPassword !== confirmPassword) {
        alert("Las contraseñas no coinciden");
        return;
      }

      try {
        const response = await fetch("/actualizar-pass", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, newPassword })
        });

        if (!response.ok) {
          if (response.status === 401) {
            alert("Tiempo de enlace expirado, redirigiendo al inicio.");
            window.location.href = "/login"; // Redirigir a la página de inicio de sesión
            return
          }
          throw new Error('Error al actualizar la contraseña');
        }

        const data = await response.json();
        alert("Contraseña actualizada correctamente");
        console.log(data);
      } catch (error) {
        // Manejar errores
        console.error('Error:', error.message);
      }
    });
  }
});
/*Evento conexion-establecida: Imprime un mensaje cuando la conexión con el servidor se establece correctamente.
Evento newProduct: Imprime datos del nuevo producto y agrega una entrada en la lista de productos en la interfaz.
Evento deleteProduct: Elimina un producto de la interfaz basándose en su ID.
Evento DOMContentLoaded: Contiene una serie de interacciones del usuario, como redirecciones al
hacer clic en botones, obtener el ID del carrito del usuario y enviar formularios (registro y cambio de contraseña).
además, maneja eventos de socket para actualizar la interfaz en tiempo real cuando ocurren ciertos eventos del servidor.*/