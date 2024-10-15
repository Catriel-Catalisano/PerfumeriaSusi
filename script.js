// Inicialización del carrito
let cart = [];

// Función para agregar productos al carrito
function addToCart(name, price, description) {
    // Verificar si el producto ya existe en el carrito
    const existingProduct = cart.find(product => product.name === name);

    if (existingProduct) {
        existingProduct.quantity += 1; // Si ya está en el carrito, aumenta la cantidad
    } else {
        const product = { name, price, description, quantity: 1 };
        cart.push(product); // Agregar nuevo producto
    }

    updateCart(); // Actualizar el carrito en la interfaz
}

// Función para actualizar la vista del carrito
function updateCart() {
    const cartItemsDiv = document.getElementById('cart-items');
    const totalItemsElement = document.getElementById('total-items');
    const totalPriceElement = document.getElementById('total-price');

    // Si el carrito está vacío
    if (cart.length === 0) {
        cartItemsDiv.innerHTML = '<p id="empty-message">Tu carrito está vacío.</p>';
    } else {
        cartItemsDiv.innerHTML = '<h2>Productos en tu carrito:</h2>';
        let totalItems = 0;
        let totalPrice = 0;

        cart.forEach(product => {
            totalItems += product.quantity;
            totalPrice += product.price * product.quantity;

            cartItemsDiv.innerHTML += `
                <div>
                    <p><strong>${product.name}</strong> (${product.quantity} x $${product.price})</p>
                    <p><small>${product.description}</small></p>
                </div>
            `;
        });

        // Actualizar los totales en la interfaz
        totalItemsElement.textContent = totalItems;
        totalPriceElement.textContent = totalPrice.toFixed(2); // Formato con dos decimales
    }
}

// Integración con Mercado Pago (usar las credenciales que me proporcionaste)
const mp = new MercadoPago('APP_USR-4d838003-4cfd-47a3-8010-0ec3c8c40150', {
    locale: 'es-AR'
});

// Evento para el botón de checkout
document.getElementById('checkout-btn').addEventListener('click', () => {
    if (cart.length > 0) {
        createPreference(); // Crear la preferencia de pago
    } else {
        alert('El carrito está vacío.');
    }
});

// Función para crear la preferencia de pago
function createPreference() {
    const items = cart.map(product => ({
        title: product.name,
        unit_price: product.price,
        quantity: product.quantity
    }));

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
        // Redirigir al Checkout Pro de Mercado Pago
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
        console.error('Error:', error);
        alert('Hubo un problema al procesar el pago.');
    });
}
