import { Router} from 'express';
import cartModel from '../model/cart.Model.js';
import { productModel } from '../model/product.model.js';


const router = Router();


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



// POST para agregar un producto a un carrito
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

        //   descontar el stock en mongo
        product.stock -= quantity;
        await product.save();

        //  agregar el product al carro
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

// DELETE para eliminar un producto de un carrito por id 
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

            product.stock += cart.products[productIndex].quantity;     //sumar de vuelta al stock de mongo 
            await product.save();

            cart.products.splice(productIndex, 1);      //  Elminar el producto del carro 
            await cart.save();

            res.status(200).json({ message: 'Producto eliminado del carrito con éxito', cart });
        } else {
            res.status(404).json({ message: 'No se encontro el producto en el carrito' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Se produjo un error al intentar eliminar un producto, intentelo nuevamente', error: err });
    }
});


// DELETE para eliminar todos los productos de un carrito

router.delete('/:cid', async (req, res) => {
    const { cid } = req.params;

    try {
        const cart = await cartModel.findById(cid);
        if (!cart) {
            return res.status(404).json({ message: 'No se encontro el carrito' });
        }

        // recuperar otdos los productos del carro
        const productUpdates = cart.products.map(async (item) => {
            const product = await productModel.findById(item.productId);
            if (product) {
                product.stock += item.quantity;
                await product.save();
            }
        });

        await Promise.all(productUpdates);  // esperar a que se actualien los stocks antes de guardar

        cart.products = [];
        await cart.save();

        res.status(200).json({ message: 'Se eliminaron los productos del carrito exitosamente', cart });
    } catch (err) {
        res.status(500).json({ message: 'Se produjo un error al eliminar los productos, intentelo nuevamente', error: err });
    }
});

// PUT para modificar la cantidad de un producto que tengams en un carrito 

router.put('/:cid/product/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    if (quantity == null  || quantity == 0) {
        return res.status(400).json({ message: 'Debe proporcionar una cantidad válida' });
    }

    try {
        const cart = await cartModel.findById(cid);
        if (!cart) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }

        const product = await productModel.findById(pid);
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        const cartProduct = cart.products.find(p => p.productId.toString() === pid);
        if (!cartProduct) {
            return res.status(404).json({ message: 'Producto no encontrado en el carrito' });
        }

        const newQuantity = cartProduct.quantity + quantity;

        if (newQuantity < 0) {
            return res.status(400).json({ message: 'No se puede reducir la cantidad por debajo de cero' });
        }

        //  validacion para ver si alcanza el stock para la nueva cantidad
        if (quantity > 0 && product.stock < quantity) {
            return res.status(400).json({ message: 'Stock insuficiente para la cantidad solicitada' });
        }

        if (newQuantity === 0) {
            // si la cantidad nva queda en 0 eliminar el prod del carro
            cart.products = cart.products.filter(p => p.productId.toString() !== pid);
        } else {
            // actualizar el quantity del carro
            cartProduct.quantity = newQuantity;
        }
        
        await cart.save();

        // actualizar stock en mongo
        product.stock -= quantity;
        await product.save();

        res.status(200).json({ message: newQuantity === 0 ? 'Producto eliminado del carrito con éxito' : 'Cantidad actualizada con éxito', cart });
    } catch (err) {
        res.status(500).json({ message: 'Error al actualizar la cantidad del producto en el carrito', error: err });
    }
});

export default router;




