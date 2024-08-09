import { Router } from 'express';
import ProductManager from '../Class/productManager.js';
import { __dirname } from '../utils.js';
import { productModel } from '../model/product.model.js'
import cartModel from '../model/cart.Model.js';
import mongoose from 'mongoose';


const viewRoute = Router();
const productManager = new ProductManager(__dirname + '/data/product.json');

// GET para listar todos los productos (con archivos locales, 2da preentrega)
viewRoute.get('/home', async (req, res) => {
    try {
        const productList = await productManager.getProductList();
        res.render('home', { productList });
    } catch (error) {
        console.error('Error al obtener la lista de productos:', error);
        res.status(500).json({ message: 'Error al obtener la lista de productos' });
    }
});

// GET para mostrar productos en tiempo real (con archivos locales 2da preentrega)
viewRoute.get('/realtimeproducts', async (req, res) => {
    const productList = await productManager.getProductList();
    res.render('realTimeProducts', { productList });
});



// GET para mostrar todos los productos vista /products

viewRoute.get('/products', async (req, res)=>{
    try {
        const productList = await productModel.find().lean();

        if (productList) {
            res.render('index', { productList });
        } else {
            res.status(404).json({ message: 'No se encontraron productos' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al buscar productos', error: error.message });
    }
});


// GET para mostrar detalles de un producto en vista /products/:pid
viewRoute.get('/products/:pid', async (req, res) => {
    const { pid } = req.params;
    const cid = '66b53f8d674ee772aa45240a';    // para el boton añadir al carrito, voy a usar el mismo carro
    try {
        const productFinded = await productModel.findById(pid).lean();

        if (productFinded) {
            res.render('productDetail', { productFinded , cid });
        } else {
            res.status(404).json({ message: 'No se encontro el producto' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al buscar el producto', error: error.message });
    }
});

// GET para traer todos los carritos
viewRoute.get('/carts', async (req, res) => {
    try {
        const carts = await cartModel.find().populate('products.productId').lean();

        // calcular total de carro (me ayude con gpt porque no me salia)
        carts.forEach(cart => {
            cart.total = cart.products.reduce((total, item) => {
                const productPrice = item.productId.price || 0;
                return total + (productPrice * item.quantity);
            }, 0);
        });

        res.render('cartsMain', { carts });
    } catch (err) {
        res.status(500).json({ message: 'Error al obtener los carritos', error: err });
    }
});


// GET para un carrito por :cid

viewRoute.get('/carts/:cid', async (req, res) => {
    const cid = '66b53f8d674ee772aa45240a';  // predefinir el carrito para eliminar (no me salia por param)
    try {
        const cart = await cartModel.findById(cid).populate('products.productId').lean();
        if (!cart) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }

        let total = 0;
        for (const item of cart.products) {
            total += item.quantity * item.productId.price;
        }

        res.render('cartDetail', { cart, total });
    } catch (error) {
        res.status(500).json({ message: 'Error al buscar el carrito', error: error.message });
    }
});


export default viewRoute;
