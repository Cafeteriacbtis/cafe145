let cart = [];

// Función para añadir artículos al carrito
function addToCart(name, price) {
    // Busca si el producto ya está en el carrito
    const existingProduct = cart.find(item => item.name === name);
    if (existingProduct) {
        existingProduct.quantity += 1; // Incrementa la cantidad si ya está en el carrito
    } else {
        cart.push({ name, price, quantity: 1 }); // Agrega el nuevo producto
    }
    updateCart();
}

// Función para eliminar un artículo específico del carrito
function removeFromCart(name) {
    // Busca el producto en el carrito
    const productIndex = cart.findIndex(item => item.name === name);
    if (productIndex > -1) {
        if (cart[productIndex].quantity > 1) {
            cart[productIndex].quantity -= 1; // Disminuye la cantidad si es mayor que 1
        } else {
            cart.splice(productIndex, 1); // Elimina el producto si la cantidad es 1
        }
    }
    updateCart();
}

// Función para actualizar la visualización del carrito
function updateCart() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    cartItems.innerHTML = '';
    let total = 0;

    cart.forEach((item) => {
        const li = document.createElement('li');
        li.textContent = `${item.name} - $${item.price} x ${item.quantity}`;
        
        const removeButton = document.createElement('button');
        removeButton.innerHTML = '🗑️'; // O puedes usar '-1' para un botón de decremento
        removeButton.classList.add('remove-button'); // Añadir clase para estilos
        removeButton.onclick = () => removeFromCart(item.name);
        li.appendChild(removeButton);
        
        cartItems.appendChild(li);
        total += item.price * item.quantity;
    });

    cartTotal.textContent = total.toFixed(2);
}


// Vaciar el carrito
document.getElementById('clear-cart').addEventListener('click', () => {
    cart = [];
    updateCart();
});

// Realizar el pago y mostrar el folio
document.getElementById('checkout').addEventListener('click', () => {
    const folio = Math.floor(Math.random() * 1000000); // Generar un número de folio aleatorio
    const purchaseDetails = cart.map(item => `${item.name} - $${(item.price * item.quantity).toFixed(2)} x ${item.quantity}`);

    const modalDetails = document.getElementById('modal-details');
    modalDetails.innerHTML = ''; // Limpiar contenido anterior

    purchaseDetails.forEach(detail => {
        const li = document.createElement('li');
        li.textContent = detail;
        modalDetails.appendChild(li);
    });

    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2);

    // Mostrar el modal con los detalles de la compra
    document.getElementById('modal-folio').textContent = folio;
    document.getElementById('modal-total').textContent = totalPrice;
    document.getElementById('myModal').style.display = "block";

    // Enviar el folio, los detalles de la compra y el total por correo electrónico
    sendEmail(folio, purchaseDetails.join('\n'), totalPrice);

    // Vaciar el carrito después del pago
    cart = [];
    updateCart();
});


// Función para enviar los detalles de la compra mediante EmailJS
function sendEmail(folio, purchaseDetails, totalPrice) {
    emailjs.send('service_fv86swt', 'cbtis145-145', {
        folio: folio,
        message: purchaseDetails,
        total: totalPrice,
        to_email: 'cbtiscafeteria03@gmail.com'
    })
    .then((response) => {
        console.log('Correo enviado exitosamente!', response.status, response.text);
    }, (error) => {
        console.error('Error al enviar el correo.', error);
    });
}

// Cerrar la ventana modal
document.querySelector('.close').addEventListener('click', () => {
    document.getElementById('myModal').style.display = "none";
});

// Descargar el folio como imagen
document.getElementById('download').addEventListener('click', () => {
    html2canvas(document.getElementById('modal-content')).then(canvas => {
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = 'folio.png';
        link.click();
    });
});
