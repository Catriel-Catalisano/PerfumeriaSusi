// Inicialización del carrito
let cart = [];

// Productos de ejemplo
const productos = {
    'h1': { id: 'h1', name: 'Perfume Hombre Boos Intense Blue', price: 1 },
    'h2': { id: 'h2', name: 'Perfume Hombre Bross London Blue', price: 2 },
    'm1': { id: 'm1', name: 'Perfume Mujer Boss Cartera', price: 1 },
    'm2': { id: 'm2', name: 'Perfume Mujer 2', price: 1800 },
    'n1': { id: 'n1', name: 'Perfume Niño 1', price: 1200 },
    'n2': { id: 'n2', name: 'Perfume Niño 2', price: 1300 }
};

// Función para agregar productos al carrito
function addToCart(productId) {
    const product = productos[productId];
    
    // Verificar si el producto existe en el carrito
    const existingProduct = cart.find(item => item.id === productId);
    
    if (existingProduct) {
        existingProduct.quantity += 1; // Aumentar cantidad
    } else {
        cart.push({ ...product, quantity: 1 }); // Agregar producto al carrito
    }
    
    updateCart();
}

// Función para actualizar la vista del carrito
function updateCart() {
    const cartItemsDiv = document.getElementById('cart-items');
    const totalItemsElement = document.getElementById('total-items');
    const totalPriceElement = document.getElementById('total-price');

    cartItemsDiv.innerHTML = ''; // Limpiar la vista del carrito
    let totalItems = 0;
    let totalPrice = 0;

    // Mostrar productos en el carrito
    cart.forEach(product => {
        if (product.id !== 'envio') {  // Excluimos el ítem "Envío" del cálculo de productos
            totalItems += product.quantity;
            totalPrice += product.price * product.quantity;

            cartItemsDiv.innerHTML += `
                <div>
                    <p><strong>${product.name}</strong> (${product.quantity} x $${product.price})</p>
                </div>
            `;
        }
    });

    // Mostrar el ítem de "Envío" si está presente
    const envioItem = cart.find(item => item.id === 'envio');
    if (envioItem) {
        cartItemsDiv.innerHTML += `
            <div>
                <p><strong>Envío</strong> (${envioItem.ubicacion}): $${envioItem.price}</p>
            </div>
        `;
        totalPrice += envioItem.price;  // Agregar el precio de envío al total
    }

    // Mostrar totales de productos
    totalItemsElement.textContent = totalItems;
    totalPriceElement.textContent = totalPrice.toFixed(2);
}

// Función para desplegar/cerrar secciones
document.addEventListener("DOMContentLoaded", function () {
    // Función para desplegar/cerrar secciones
    const toggleSections = document.querySelectorAll('.toggle-section');
    toggleSections.forEach((sectionTitle) => {
        sectionTitle.addEventListener('click', function () {
            const productSlider = this.nextElementSibling; // Selecciona el contenedor de productos
            productSlider.classList.toggle('active'); // Alterna la visibilidad de los productos
        });
    });

    // Agregar eventos a los botones de "Comprar"
    const buyButtons = document.querySelectorAll('.buy-btn');
    buyButtons.forEach(button => {
        button.addEventListener('click', function () {
            const productId = this.getAttribute('data-id');
            addToCart(productId); // Llamamos a la función para agregar al carrito
        });
    });

    // Inicializar el carrito vacío al cargar la página
    updateCart();
});

// Precio base de los productos en el carrito (esto debe ser dinámico, se pone un ejemplo fijo aquí)
let costoEnvio = 0;  // Costo inicial de envío
let ubicacionEnvio = '';  // Almacenamos la ubicación seleccionada

// Elementos DOM
const ubicacionSelect = document.getElementById("ubicacion");
const costoEnvioElement = document.getElementById("precio-envio");
const actualizarCarritoBtn = document.getElementById("actualizar-carrito");
const totalPriceElement = document.getElementById("total-price");

// Función para calcular el costo de envío según la ubicación seleccionada
function calcularCostoEnvio(ubicacion) {
    switch (ubicacion) {
        case "buenos-aires":
            return 500;
        case "cordoba":
            return 700;
        case "rosario":
            return 600;
        default:
            return 0;
    }
}

// Función para actualizar el precio total (productos + costo de envío)
function actualizarTotalCarrito() {
    let totalPrice = 0;

    // Recalcular el precio total de los productos en el carrito
    cart.forEach(product => {
        if (product.id !== 'envio') {  // Excluimos el ítem "Envío" del cálculo de productos
            totalPrice += product.price * product.quantity;
        }
    });

    // Agregar el costo de envío al precio total (solo si existe)
    if (costoEnvio > 0) {
        totalPrice += costoEnvio;
    }

    totalPriceElement.textContent = totalPrice.toFixed(2);  // Mostrar el total con envío
}

// Escucha el evento de envío del formulario para calcular el costo de envío
document.getElementById("envio-form").addEventListener("submit", function (event) {
    event.preventDefault(); // Prevenir que se recargue la página

    // Obtener la ubicación seleccionada
    const ubicacion = ubicacionSelect.value;
    ubicacionEnvio = ubicacion;  // Almacenamos la ubicación seleccionada

    // Calcular el costo de envío
    costoEnvio = calcularCostoEnvio(ubicacion);

    // Mostrar el costo de envío
    costoEnvioElement.textContent = costoEnvio;

    // Verificar si ya existe el ítem de "Envío" en el carrito
    const existingShippingItem = cart.find(item => item.id === 'envio');
    
    if (existingShippingItem) {
        // Si existe, solo actualizamos el valor del envío y la ubicación (no agregar de nuevo)
        existingShippingItem.price = costoEnvio;
        existingShippingItem.ubicacion = ubicacionEnvio;  // Actualizar la ubicación
        existingShippingItem.quantity = 1;  // Asegurarnos de que no se multiplica
    } else {
        // Si no existe, agregamos el ítem de "Envío"
        const envio = {
            id: 'envio',
            name: 'Envío',
            price: costoEnvio,
            quantity: 1,
            ubicacion: ubicacionEnvio  // Almacenamos la ubicación seleccionada en el carrito
        };
        cart.push(envio);  // Agregar el ítem de envío al carrito
    }

    // Actualizar el carrito
    updateCart();
    actualizarTotalCarrito();  // Actualizar el total con el costo de envío
});

// Evento para actualizar el carrito
actualizarCarritoBtn.addEventListener("click", function () {
    if (ubicacionSelect.value) {
        alert("El carrito se ha actualizado con el nuevo costo de envío.");
    } else {
        alert("Por favor, selecciona una ubicación para calcular el costo de envío.");
    }
});

// Inicialización de MercadoPago
const mp = new MercadoPago('APP_USR-4d838003-4cfd-47a3-8010-0ec3c8c40150', {
    locale: 'es-AR'
});

// Función para crear la preferencia de pago
function createPreference() {
    const items = cart.map(product => (product.id !== 'envio') ? {
        title: product.name,
        unit_price: product.price,
        quantity: product.quantity
    } : null).filter(item => item !== null);

    // Agregar el ítem de "Envío" a los productos
    const envioItem = cart.find(item => item.id === 'envio');
    if (envioItem) {
        items.push({
            title: 'Envío',
            unit_price: envioItem.price,
            quantity: 1
        });
    }

    fetch("https://api.mercadopago.com/checkout/preferences", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer APP_USR-5734769419465043-101414-5dd1ac1e3b6acaf1f36e1381acd773f2-119842015`
        },
        body: JSON.stringify({
            items: items,
            back_urls: {
                success: "http://localhost/success", // Cambia a tus URLs reales
                failure: "http://localhost/failure",
                pending: "http://localhost/pending"
            },
            auto_return: "approved"
        })
    })
    .then(response => response.json())
    .then(preference => {
        mp.checkout({
            preference: {
                id: preference.id
            },
            render: {
                container: '#checkout-btn', // Colocar el botón en este div
                label: 'Pagar con Mercado Pago', // Texto del botón
            }
        });
    })
    .catch(error => {
        console.error('Error al crear la preferencia de pago:', error);
    });
}

// Al hacer clic en el botón "Pagar con Mercado Pago"
document.getElementById("checkout-btn").addEventListener('click', function () {
    if (cart.length > 0) {
        createPreference(); // Llamamos a la función para crear la preferencia y realizar el pago
    } else {
        alert('El carrito está vacío. Agrega productos antes de pagar.');
    }
});
