import fs from 'fs';
import ProductManager from './productManager.js';

class CartManager {
    constructor(path, productManager) {
        this.path = path;
        this.cartList = [];
        this.productManager = productManager; 
    }

    async getCartList() {
        try {
            const list = await fs.promises.readFile(this.path, 'utf-8');
            this.cartList = JSON.parse(list).data;
        } catch (error) {
            console.error('Error al leer el archivo del carrito:', error);
            this.cartList = [];
        }
        return [...this.cartList];
    }

    async createCart() {
        try {
            await this.getCartList();

            const newCart = {
                id: this.generateId(),
                products: []
            };

            this.cartList.push(newCart);

            await fs.promises.writeFile(this.path, JSON.stringify({ data: this.cartList }));
            return newCart;
        } catch (error) {
            console.error('Error al crear el carrito:', error);
            throw new Error('No se pudo crear el carrito');
        }
    }

    generateId() {
        const ids = this.cartList.map(cart => cart.id);
        const maxId = ids.length > 0 ? Math.max(...ids) : 999; // Aca los IDs incian desde 1000
        return maxId + 1;
    }

    async getCartProducts(cartId) {
        await this.getCartList();
        const cart = this.cartList.find(cart => cart.id == cartId);
        return cart ? cart.products : [];
    }

    async addProductToCart(cartId, productId) {
        await this.getCartList();
        const cart = this.cartList.find(cart => cart.id == cartId);
        if (!cart) {
            throw new Error('Carrito no encontrado');
        }

        const product = await this.productManager.getProductById(productId);
        if (!product) {
            throw new Error('Producto no encontrado');
        }

        const productIndex = cart.products.findIndex(product => product.product === productId);
        if (productIndex !== -1) {
            cart.products[productIndex].quantity += 1;
        } else {
            cart.products.push({ product: productId, quantity: 1 });
        }

        await fs.promises.writeFile(this.path, JSON.stringify({ data: this.cartList }));
    }
}

export default CartManager;

