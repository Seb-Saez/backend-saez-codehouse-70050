import express, { response } from 'express'
import ProductManager from './Class/productManager.js';
import { __dirname } from './utils.js';
import { log } from 'console';


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const productManager = new ProductManager( __dirname + '/data/product.json');

app.post('/', async (req , res) => {
    await productManager.addProduct()
    res.status(201).json({message: 'Producto añadido con exito'})
})


app.get('/', async (req , res) => {
    const productList = await productManager.getProductList();
    res.status(201).json({ resultado : productList});
})

app.listen(8080, () => {
    console.log('Server runing well')
})
