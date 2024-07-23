import express from 'express';
import ProductManager from './Class/productManager.js';
import CartManager from './Class/cartManager.js';
import { __dirname } from './utils.js';
import ProductRoute from './routes/products.router.js';
import cartRouter from './routes/carts.router.js';
import handlebars from 'express-handlebars';
import viewRoute from './routes/views.router.js';

// config de express
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// config de handlebars
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');


// config de estaticos
app.use('/static', express.static(__dirname + '/public'));

// config de managers
const productManager = new ProductManager(__dirname + '/data/product.json');
const cartManager = new CartManager(__dirname + '/data/cart.json', productManager);


// routes
app.use('/api/products', ProductRoute);
app.use('/api/carts', cartRouter);
app.use('/', viewRoute);

app.listen(8080, () => {
    console.log('Servidor corriendo en el puerto 8080');
});
