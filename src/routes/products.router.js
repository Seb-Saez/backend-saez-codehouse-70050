import { Router } from "express";
import ProductManager from '../Class/productManager.js';
import { __dirname } from '../utils.js';

const router = Router();

const productManager = new ProductManager(__dirname + '/data/product.json');

// POST para agregar un nuevo producto
router.post('/', async (req, res) => {
    const { title, description, code, price, status, stock, category, thumbnails } = req.body;

    if (!title || !description || !code || price === undefined || status === undefined || stock === undefined || !category || !Array.isArray(thumbnails)) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios y thumbnails debe ser un array' });
    }

    const product = { title, description, code, price, status, stock, category, thumbnails };
    await productManager.addProduct(product);
    res.status(201).json({ message: 'Producto añadido con éxito' });
});


// GET para obtener un producto por id
router.get('/:pid', async (req, res) => {
    const { pid } = req.params;
    const productFind = await productManager.getProductById(pid);

    if (productFind) {
        res.status(200).json({ resultado: productFind });
    } else {
        res.status(404).json({ message: 'Producto no encontrado' });
    }
});

// PUT para actualizar un producto por id
router.put('/:pid', async (req, res) => {
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
router.delete('/:pid', async (req, res) => {
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

export default router;