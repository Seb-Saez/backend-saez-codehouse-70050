import express from 'express';
import ProductManager from './Class/productManager.js';
import CartManager from './Class/cartManager.js';
import { __dirname } from './utils.js';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const productManager = new ProductManager(__dirname + '/data/product.json');
const cartManager = new CartManager(__dirname + '/data/cart.json', productManager);

// POST para agregar un nuevo producto
app.post('/', async (req, res) => {
    const { title, description, code, price, status, stock, category, thumbnails } = req.body;

    if (!title || !description || !code || price === undefined || status === undefined || stock === undefined || !category || !Array.isArray(thumbnails)) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios y thumbnails debe ser un array' });
    }

    const product = { title, description, code, price, status, stock, category, thumbnails };
    await productManager.addProduct(product);
    res.status(201).json({ message: 'Producto añadido con éxito' });
});

// GET para listar todos los productos
app.get('/', async (req, res) => {
    const productList = await productManager.getProductList();
    res.status(200).json({ resultado: productList });
});

// GET para obtener un producto por id
app.get('/:pid', async (req, res) => {
    const { pid } = req.params;
    const productFind = await productManager.getProductById(pid);

    if (productFind) {
        res.status(200).json({ resultado: productFind });
    } else {
        res.status(404).json({ message: 'Producto no encontrado' });
    }
});

// PUT para actualizar un producto por id
app.put('/:pid', async (req, res) => {
    const { pid } = req.params;
    const productData = req.body;

    if (!Object.keys(productData).length) {
        return res.status(400).json({ message: 'Debe proporcionar al menos un campo para actualizar' });
    }

    try {
        const updatedProduct = await productManager.updateProduct(pid, productData);

        if (updatedProduct) {
            res.status(202).json({ message: 'Producto actualizado con éxito' });
        } else {
            res.status(404).json({ message: 'Producto no encontrado' });
        }
    } catch (error) {
        console.error('Error al actualizar el producto:', error);
        res.status(500).json({ message: 'Error al actualizar el producto' });
    }
});

// DELETE para eliminar un producto por id
app.delete('/:pid', async (req, res) => {
    const { pid } = req.params;

    try {
        const deletedProduct = await productManager.deleteProduct(pid);

        if (deletedProduct) {
            res.status(203).json({ message: 'Producto eliminado con éxito' });
        } else {
            res.status(404).json({ message: 'Producto no encontrado' });
        }
    } catch (error) {
        console.error('Error al eliminar el producto:', error);
        res.status(500).json({ message: 'Error al eliminar el producto' });
    }
});

// POST para crear un nuevo carrito
app.post('/api/carts/', async (req, res) => {
    try {
        const newCart = await cartManager.createCart();
        res.status(201).json({ message: 'Carrito creado con éxito', cart: newCart });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el carrito' });
    }
});

// GET para listar los productos de un carrito por id
app.get('/api/carts/:cid', async (req, res) => {
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
app.post('/api/carts/:cid/product/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    try {
        await cartManager.addProductToCart(cid, pid);
        res.status(201).json({ message: 'Producto agregado al carrito exitosamente' });
    } catch (error) {
        console.error('Error al agregar producto al carrito:', error);
        res.status(500).json({ error: 'No se pudo agregar el producto al carrito' });
    }
});

app.listen(8080, () => {
    console.log('Servidor corriendo en el puerto 8080');
});
