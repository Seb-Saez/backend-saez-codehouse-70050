document.addEventListener('DOMContentLoaded', () => {
    const socket = io();

    // envío del formulario
    document.getElementById('productForm').addEventListener('submit', function (e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const product = {
            title: formData.get('title'),
            description: formData.get('description'),
            code: formData.get('code'),
            price: parseFloat(formData.get('price')),
            status: formData.get('status') === 'true',
            stock: parseInt(formData.get('stock')),
            category: formData.get('category'),
            thumbnails: JSON.parse(formData.get('thumbnails'))
        };

        socket.emit('addProduct', product);
        setTimeout(() => {
            this.reset();
        }, 500);
    });

    // eliminar producto
    document.getElementById('productList').addEventListener('click', function (e) {
        if (e.target.classList.contains('deleteBtn')) {
            const productId = e.target.getAttribute('data-id');
            socket.emit('deleteProduct', productId);
        }
    });

    // actualizar la lista de productos en tiempo real
    socket.on('updateProductList', function (productList) {
        const productListDiv = document.getElementById('productList');
        productListDiv.innerHTML = '';
        productList.forEach(product => {
            const productCard = document.createElement('div');
            productCard.classList.add('card');
            productCard.innerHTML = `
                <h3>${product.title}</h3>
                <p>${product.description}</p>
                <p><strong>Precio:</strong> $${product.price}</p>
                <p><strong>Stock:</strong> ${product.stock}</p>
                <button class="deleteBtn" data-id="${product.id}">Eliminar</button>
            `;
            productListDiv.appendChild(productCard);
        });
    });
});
