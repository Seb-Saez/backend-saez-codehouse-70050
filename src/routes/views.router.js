import { Router } from 'express';
import ProductManager from '../Class/productManager.js';
import { __dirname } from '../utils.js';

const viewRoute = Router();
const productManager = new ProductManager(__dirname + '/data/product.json');

// GET para listar todos los productos
viewRoute.get('/home', async (req, res) => {
    try {
        const productList = await productManager.getProductList();
        res.render('home', { productList });
    } catch (error) {
        console.error('Error al obtener la lista de productos:', error);
        res.status(500).json({ message: 'Error al obtener la lista de productos' });
    }
});

// GET para mostrar productos en tiempo real 
viewRoute.get('/realtimeproducts', async (req, res) => {
    const productList = await productManager.getProductList();
    res.render('realTimeProducts', { productList });
});

export default viewRoute;
