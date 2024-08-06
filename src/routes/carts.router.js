import { Router} from 'express';
import cartModel from '../model/cart.Model.js';
import { productModel } from '../model/product.model.js';


const router = Router();
// const cartManager = new CartManager(__dirname + '/data/cart.json');
// const productManager = new ProductManager(__dirname + '/data/product.json');

// POST para crear un nuevo carrito
router.post('/', async (req, res) => {
    try {
        const newCart = new cartModel({ products: [] });
        await newCart.save();
        res.status(201).json( { message: "Se creo un nuevo carrito correctamente", payload: newCart});
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el carrito', error });
    }
});


// GET para traer todos los carritos
router.get('/', async (req, res) => {
    try {
        const carts = await cartModel.find().populate('products.productId');
        res.status(200).json(carts);
    } catch (err) {
        res.status(500).json({ message: 'Error al obtener los carritos', error: err });
    }
});


// GET para listar los productos de un carrito por id

router.get('/:cid', async (req, res) => {
    const { cid } = req.params;
    try {
        const cart = await cartModel.findById(cid).populate('products.productId');
        if (!cart) {
            return res.status(404).json({ message: 'No se encontro un carrito con ese ID' });
        }
        res.status(200).json(cart);
    } catch (err) {
        res.status(500).json({ message: 'Ocurrio un error, intentelo nuevamente', error: err });
    }
});



// POST para agregar un producto a un carrito y actualizar el stock

router.post('/:cid/product/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    try {
        const cart = await cartModel.findById(cid);
        if (!cart) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }

        const product = await productModel.findById(pid);
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        if (product.stock < quantity) {
            return res.status(400).json({ message: 'Stock insuficiente' });
        }

        // Descontar el stock en mongo
        product.stock -= quantity;
        await product.save();

        // Agregar el product al carro
        const productIndex = cart.products.findIndex(p => p.productId.toString() === pid);
        if (productIndex >= 0) {
            cart.products[productIndex].quantity += quantity;
        } else {
            cart.products.push({ productId: pid, quantity });
        }

        await cart.save();
        res.status(201).json({ message: 'Producto agregado al carrito con éxito', cart });
    } catch (err) {
        res.status(500).json({ message: 'Error al agregar el producto al carrito, intentelo nuevamente', error: err });
    }
});

// Eliminar un producto de un carrito por id  (no vuelve a sumar el stock)
router.delete('/:cid/product/:pid', async (req, res) => {
    const { cid, pid } = req.params;

    try {
        const cart = await cartModel.findById(cid);
        if (!cart) {
            return res.status(404).json({ message: 'No se encontro el carrito' });
        }

        const productIndex = cart.products.findIndex(p => p.productId.toString() === pid);
        if (productIndex >= 0) {
            const product = await productModel.findById(pid);
            if (!product) {
                return res.status(404).json({ message: 'No se encontro el producto' });
            }

            // Sumar de vuelta el stock a products en la DB
            product.stock += cart.products[productIndex].quantity;
            await product.save();

            // Eliminar el producto del carrito
            cart.products.splice(productIndex, 1);
            await cart.save();

            res.status(200).json({ message: 'Producto eliminado del carrito con éxito', cart });
        } else {
            res.status(404).json({ message: 'No se encontro el producto en el carrito' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Se produjo un error al intentar eliminar un producto, intentelo nuevamente', error: err });
    }
});

export default router;




