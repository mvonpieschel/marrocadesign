document.addEventListener('DOMContentLoaded', () => {
    updateCartCounter();

    // Product page logic
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    if (addToCartButtons.length > 0) {
        addToCartButtons.forEach(button => {
            button.addEventListener('click', () => {
                const card = button.closest('.product-card');
                const title = card.querySelector('.product-title').innerText;
                const priceString = card.querySelector('.price').innerText;
                const price = parseFloat(priceString.replace('$', ''));
                const quantity = card.querySelector('.quantity').value;

                const product = {
                    title,
                    price,
                    quantity: parseInt(quantity, 10)
                };

                addToCart(product);
            });
        });
    }

    function addToCart(product) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingProductIndex = cart.findIndex(item => item.title === product.title);

        if (existingProductIndex > -1) {
            cart[existingProductIndex].quantity += product.quantity;
        } else {
            cart.push(product);
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCounter();
    }

    // Cart page logic
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');

    if (cartItemsContainer) {
        displayCartItems();
    }

    function displayCartItems() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        cartItemsContainer.innerHTML = '';
        let total = 0;

        cart.forEach(item => {
            const itemElement = document.createElement('li');
            itemElement.className = 'list-group-item d-flex justify-content-between lh-sm';
            itemElement.innerHTML = `
                <div>
                    <h6 class="my-0">${item.title}</h6>
                    <small class="text-muted">
                        Quantity:
                        <input type="number" class="cart-quantity" value="${item.quantity}" min="1" data-title="${item.title}" style="width: 50px;">
                    </small>
                </div>
                <div>
                    <span class="text-muted">$${item.price * item.quantity}</span>
                    <button class="btn btn-sm btn-danger remove-from-cart" data-title="${item.title}">Remove</button>
                </div>
            `;
            cartItemsContainer.appendChild(itemElement);
            total += item.price * item.quantity;
        });

        if (cartTotalElement) {
            cartTotalElement.innerText = `$${total}`;
        }

        // Add event listeners for remove buttons and quantity inputs
        document.querySelectorAll('.remove-from-cart').forEach(button => {
            button.addEventListener('click', (event) => {
                const title = event.target.getAttribute('data-title');
                removeItemFromCart(title);
            });
        });

        document.querySelectorAll('.cart-quantity').forEach(input => {
            input.addEventListener('change', (event) => {
                const title = event.target.getAttribute('data-title');
                const newQuantity = parseInt(event.target.value, 10);
                updateCartItemQuantity(title, newQuantity);
            });
        });
    }

    function removeItemFromCart(title) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart = cart.filter(item => item.title !== title);
        localStorage.setItem('cart', JSON.stringify(cart));
        displayCartItems();
        updateCartCounter();
    }

    function updateCartItemQuantity(title, newQuantity) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const itemIndex = cart.findIndex(item => item.title === title);

        if (itemIndex > -1) {
            if (newQuantity > 0) {
                cart[itemIndex].quantity = newQuantity;
            } else {
                cart = cart.filter(item => item.title !== title);
            }
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        displayCartItems();
        updateCartCounter();
    }

    function updateCartCounter() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const cartCounter = document.getElementById('cart-counter');
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

        if (cartCounter) {
            if (totalItems > 0) {
                cartCounter.innerText = `Carrito (${totalItems})`;
            } else {
                cartCounter.innerText = 'Carrito';
            }
        }
    }
});
