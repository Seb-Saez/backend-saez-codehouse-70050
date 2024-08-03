import express from 'express';
import ProductManager from './Class/productManager.js';
import CartManager from './Class/cartManager.js';
import { __dirname } from './utils.js';
import ProductRoute from './routes/products.router.js';
import cartRouter from './routes/carts.router.js';
import viewRoute from './routes/views.router.js';
import handlebars from 'express-handlebars';
import http from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';

// config de express
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = 8080 || 3030;


// config de websocket
const server = http.createServer(app);
const io = new Server(server);

// config de handlebars
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

// config de estáticos
app.use('/static', express.static(__dirname + '/public'));

// config de managers
const productManager = new ProductManager(__dirname + '/data/product.json');
const cartManager = new CartManager(__dirname + '/data/cart.json', productManager);

// routes
app.use('/api/products', ProductRoute);
app.use('/api/carts', cartRouter);
app.use('/', viewRoute);

// eventos de websocket 
io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');

    // Emitir la lista de productos cuando un nuevo cliente se conecta
    productManager.getProductList().then(products => {
        socket.emit('updateProductList', products);
    });

    // Escuchar para agregar un nuevo producto
    socket.on('addProduct', async (product) => {
        await productManager.addProduct(product);
        const updatedProducts = await productManager.getProductList();
        io.emit('updateProductList', updatedProducts);
    });

    // Escuchar para eliminar un producto
    socket.on('deleteProduct', async (productId) => {
        await productManager.deleteProduct(productId);
        const updatedProducts = await productManager.getProductList();
        io.emit('updateProductList', updatedProducts);
    });

    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
});

// Conectar BBDD con mongoose

mongoose.connect(
    'mongodb+srv://sebastiansaez:hipH7OsAVhpG7dAH@coderback-1-70050.vmsndmx.mongodb.net/?retryWrites=true&w=majority&appName=CoderBack-1-70050', { dbName: 'coderback' })
    .then(()=>{
        console.log("Conectado a la BBDD correctamente");
        
    })


server.listen(PORT, () => {
    console.log('Servidor corriendo en el puerto '+ PORT);
});
