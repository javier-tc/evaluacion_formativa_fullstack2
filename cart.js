//sistema de carrito simple con localStorage
class Cart {
    constructor() {
        this.items = this.loadCart();
        this.updateCartUI();
    }

    //cargar carrito desde localStorage
    loadCart() {
        const savedCart = localStorage.getItem('vinylstore_cart');
        return savedCart ? JSON.parse(savedCart) : [];
    }

    //guardar carrito en localStorage
    saveCart() {
        localStorage.setItem('vinylstore_cart', JSON.stringify(this.items));
    }

    //agregar producto al carrito
    addToCart(productId, name, price, image, artist) {
        const existingItem = this.items.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({
                id: productId,
                name: name,
                price: price,
                image: image,
                artist: artist,
                quantity: 1
            });
        }
        
        this.saveCart();
        this.updateCartUI();
    }

    //remover producto del carrito
    removeFromCart(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartUI();
    }

    //actualizar cantidad de un producto
    updateQuantity(productId, newQuantity) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            if (newQuantity <= 0) {
                this.removeFromCart(productId);
            } else {
                item.quantity = newQuantity;
                this.saveCart();
                this.updateCartUI();
            }
        }
    }

    //obtener total de productos
    getTotalItems() {
        return this.items.reduce((total, item) => total + item.quantity, 0);
    }

    //obtener precio total
    getTotalPrice() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    //limpiar carrito
    clearCart() {
        this.items = [];
        this.saveCart();
        this.updateCartUI();
    }

    //actualizar interfaz del carrito
    updateCartUI() {
        const cartCount = document.getElementById('cart-count');
        const cartItems = document.getElementById('cart-items');
        const cartTotal = document.getElementById('cart-total');
        const cartEmpty = document.getElementById('cart-empty');
        const checkoutBtn = document.querySelector('.checkout-btn');

        //actualizar contador del carrito
        if (cartCount) {
            cartCount.textContent = this.getTotalItems();
            cartCount.style.display = this.getTotalItems() > 0 ? 'block' : 'none';
        }

        //mostrar/ocultar carrito vacío
        if (cartEmpty) {
            cartEmpty.style.display = this.items.length === 0 ? 'block' : 'none';
        }

        //habilitar/deshabilitar botón de checkout
        if (checkoutBtn) {
            checkoutBtn.disabled = this.items.length === 0;
        }

        //actualizar lista de productos
        if (cartItems) {
            cartItems.innerHTML = '';
            this.items.forEach(item => {
                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item';
                cartItem.innerHTML = `
                    <div class="cart-item-image">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <p>${item.artist}</p>
                        <div class="cart-item-controls">
                            <button onclick="cart.updateQuantity(${item.id}, ${item.quantity - 1})" class="quantity-btn">-</button>
                            <span class="quantity">${item.quantity}</span>
                            <button onclick="cart.updateQuantity(${item.id}, ${item.quantity + 1})" class="quantity-btn">+</button>
                            <button onclick="cart.removeFromCart(${item.id})" class="remove-btn">Eliminar</button>
                        </div>
                    </div>
                    <div class="cart-item-price">
                        $${item.price.toLocaleString()}
                    </div>
                `;
                cartItems.appendChild(cartItem);
            });
        }

        //actualizar total
        if (cartTotal) {
            cartTotal.textContent = `$${this.getTotalPrice().toLocaleString()}`;
        }
    }

    //abrir/cerrar carrito
    toggleCart() {
        const cartModal = document.getElementById('cart-modal');
        if (cartModal) {
            cartModal.style.display = cartModal.style.display === 'block' ? 'none' : 'block';
        }
    }

    //cerrar carrito
    closeCart() {
        const cartModal = document.getElementById('cart-modal');
        if (cartModal) {
            cartModal.style.display = 'none';
        }
    }
}

//inicializar carrito
const cart = new Cart();

//agregar estilos para el carrito
const cartStyles = `
    <style>
        /*estilos del carrito*/
        .cart-icon {
            position: relative;
            cursor: pointer;
            color: var(--white);
            font-size: 1.5rem;
            padding: 0.5rem;
        }

        .cart-count {
            position: absolute;
            top: -5px;
            right: -5px;
            background: var(--secondary-color);
            color: white;
            border-radius: 50%;
            width: 20px;
            height: 20px;
            font-size: 0.8rem;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
        }

        /*modal del carrito*/
        .cart-modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            z-index: 1000;
        }

        .cart-content {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            border-radius: 10px;
            width: 90%;
            max-width: 600px;
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: var(--shadow);
        }

        .cart-header {
            padding: 1.5rem;
            border-bottom: 1px solid var(--border-color);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .cart-header h2 {
            margin: 0;
            color: var(--primary-color);
        }

        .close-cart {
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: var(--light-text);
        }

        .cart-body {
            padding: 1.5rem;
        }

        .cart-empty {
            text-align: center;
            padding: 2rem;
            color: var(--light-text);
        }

        .cart-item {
            display: flex;
            gap: 1rem;
            padding: 1rem 0;
            border-bottom: 1px solid var(--border-color);
        }

        .cart-item-image {
            width: 80px;
            height: 80px;
            border-radius: 5px;
            overflow: hidden;
        }

        .cart-item-image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .cart-item-info {
            flex: 1;
        }

        .cart-item-info h4 {
            margin: 0 0 0.5rem 0;
            color: var(--primary-color);
        }

        .cart-item-info p {
            margin: 0 0 1rem 0;
            color: var(--light-text);
            font-size: 0.9rem;
        }

        .cart-item-controls {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .quantity-btn {
            background: var(--gray-light);
            border: none;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .quantity-btn:hover {
            background: var(--border-color);
        }

        .quantity {
            margin: 0 0.5rem;
            font-weight: bold;
        }

        .remove-btn {
            background: var(--secondary-color);
            color: white;
            border: none;
            padding: 0.3rem 0.8rem;
            border-radius: 15px;
            cursor: pointer;
            font-size: 0.8rem;
        }

        .remove-btn:hover {
            background: #c0392b;
        }

        .cart-item-price {
            font-weight: bold;
            color: var(--secondary-color);
            font-size: 1.1rem;
        }

        .cart-footer {
            padding: 1.5rem;
            border-top: 1px solid var(--border-color);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .cart-total {
            font-size: 1.5rem;
            font-weight: bold;
            color: var(--primary-color);
        }

        .checkout-btn {
            background: var(--secondary-color);
            color: white;
            border: none;
            padding: 1rem 2rem;
            border-radius: 25px;
            cursor: pointer;
            font-weight: bold;
            transition: var(--transition);
        }

        .checkout-btn:hover {
            background: #c0392b;
            transform: translateY(-2px);
        }

        .checkout-btn:disabled {
            background: var(--light-text);
            cursor: not-allowed;
            transform: none;
        }

        /*animaciones*/
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }

        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }

        /*responsive*/
        @media (max-width: 768px) {
            .cart-content {
                width: 95%;
                max-height: 90vh;
            }
            
            .cart-item {
                flex-direction: column;
                text-align: center;
            }
            
            .cart-item-image {
                width: 100%;
                height: 150px;
                margin: 0 auto;
            }
            
            .cart-footer {
                flex-direction: column;
                gap: 1rem;
            }
        }
    </style>
`;

//agregar estilos al documento
document.head.insertAdjacentHTML('beforeend', cartStyles);
