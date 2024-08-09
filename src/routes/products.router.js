import { Router } from "express";
import { __dirname } from '../utils.js';
import ProductManager from "../Class/productManager.js";
import { productModel } from "../model/product.model.js";   // importacion del productModel

const router = Router();

const productManager = new ProductManager(__dirname + '/data/product.json');

// POST para agregar un nuevo producto
router.post('/', async (req, res) => {
    try {
        const { title, description, code, price, status, stock, category, thumbnails } = req.body;

        if (!title || !description || !code || price === undefined || price < 0 || status === undefined || stock === undefined || stock < 0 || !category || !Array.isArray(thumbnails)) {
            return res.status(401).json({ message: 'Todos los campos son obligatorios y thumbnails debe ser un array' });
        }

        const product = { title, description, code, price, status, stock, category, thumbnails };
        const newProduct = await productModel.create(product);
        res.status(201).json({ message: 'Producto añadido con éxito: ' + newProduct.title });
    } catch (err) {
        res.status(500).json({ mesagge: "Ocurrio un error, por favor intentelo nuevamente completando los campos" });
    }
});



// GET para obtener todos los productos 
router.get('/', async (req, res) => {
    try {
        const productFind = await productModel.find();

        if (productFind) {
            res.status(200).json({ message: "Se encontraron los siguientes productos", resultado: productFind });
        } else {
            res.status(404).json({ message: 'No se encontraron productos' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al buscar productos', error: error.message });
    }
});


// GET para obtener un producto por id
router.get('/:pid', async (req, res) => {
    const { pid } = req.params;
    try {
        const productFind = await productModel.findById(pid);

        if (productFind) {
            res.status(200).json({ message: "Se encontró el siguiente producto", resultado: productFind });
        } else {
            res.status(404).json({ message: 'Producto no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al buscar el producto', error: error.message });
    }
});


// PUT para actualizar un producto por id

router.put('/:pid', async (req, res) => {
    const { pid } = req.params;
    const productData = req.body;

    if (!Object.keys(productData).length) {
        return res.status(400).json({ message: 'Debe proporcionar al menos un campo para actualizar' });
    }
    // validar si cumple con el schema de mongoose y no tiene stock negativo
    try {
        const validationError = new productModel(productData).validateSync();
        if (validationError) {
            return res.status(400).json({ message: 'Los datos no son validos, asegurese de cumplir con el formato adecuado', errors: validationError.errors });
        }

        if (productData.stock !== undefined && productData.stock < 0) {
            return res.status(400).json({ message: 'El stock no puede ser negativo' });
        }

        const updatedProduct = await productModel.findByIdAndUpdate(pid, {
            ...productData
        }, { new: true, runValidators: true });

        if (!updatedProduct) {
            return res.status(404).json({ message: `El producto con id: ${pid} no fue encontrado` });
        }

        res.status(200).json({ message: `El producto con id: ${pid} fue actualizado con éxito`, payload: updatedProduct });
    } catch (err) {
        res.status(500).json({ message: 'Ocurrió un error al actualizar el producto, por favor intente nuevamente', error: err.message });
    }
});



// DELETE para eliminar un producto por id
router.delete('/:pid', async (req , res)=>{
    const { pid } = req.params;
    try {
        const deletedProduct = await productModel.findByIdAndDelete( pid );

        if (!deletedProduct) {
            return res.status(404).json({ message: `El producto con id: ${pid} no fue encontrado` });
        }
        res.status(200).json( { message: `El producto con id: ${pid} fue eliminado con exito`})
    }
    catch (err){
        res.status(500).json( { message: 'Ocurrio un error al eliminar el producto', error: err});
    }

})

export default router;