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
        totalItems += product.quantity;
        totalPrice += product.price * product.quantity;

        cartItemsDiv.innerHTML += `
            <div>
                <p><strong>${product.name}</strong> (${product.quantity} x $${product.price})</p>
            </div>
        `;
    });

    // Mostrar totales
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

// Integración con Mercado Pago
const mp = new MercadoPago('APP_USR-4d838003-4cfd-47a3-8010-0ec3c8c40150', {
    locale: 'es-AR'
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

// Evento para el botón de checkout
document.getElementById('checkout-btn').addEventListener('click', () => {
    if (cart.length > 0) {
        createPreference(); // Crear la preferencia de pago
    } else {
        alert('El carrito está vacío.');
    }
});
