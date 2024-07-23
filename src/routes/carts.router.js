import { Router} from 'express';
import CartManager from '../Class/cartManager.js';
import { __dirname } from '../utils.js';
import ProductManager from '../Class/productManager.js';


const router = Router();
const cartManager = new CartManager(__dirname + '/data/cart.json');
const productManager = new ProductManager(__dirname + '/data/product.json');

// POST para crear un nuevo carrito
router.post('/', async (req, res) => {
    try {
        const newCart = await cartManager.createCart();
        res.status(201).json({ message: 'Carrito creado con éxito', cart: newCart });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el carrito' });
    }
});

// GET para listar los productos de un carrito por id
router.get('/:cid', async (req, res) => {
    const { cid } = req.params;
    try {
        const cartProducts = await cartManager.getCartProducts(cid);
        res.status(200).json({ products: cartProducts });
    } catch (error) {
        console.error('Error al obtener los productos del carrito:', error);
        res.status(500).json({ error: 'No se pudieron obtener los productos del carrito' });
    }
});

// POST para agregar un producto a un carrito por cid y pid
router.post('/:cid/product/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    try {
        await cartManager.addProductToCart(cid, pid);
        res.status(201).json({ message: 'Producto agregado al carrito exitosamente' });
    } catch (error) {
        console.error('Error al agregar producto al carrito:', error);
        res.status(500).json({ error: 'No se pudo agregar el producto al carrito' });
    }
});


export default router;