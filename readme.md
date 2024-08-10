A continuacion se listaran las instrucciones para utilizar el programa desde insomnia:

█ Manejo de productos:

- Agregar un producto: por body con un objeto json respetando el siguiente Schema

POST - http://localhost:8080/api/products/

Body:
{
        "title": String,
        "description": String,
        "code": Number,
        "price": Number,
        "status": Boolean,
        "stock": Number,
        "category": {
            type: String,
            enum: ["Perifericos", "Monitores", "Notebooks", "GPU", "Gabinetes"]
        }
        "thumbnails": ["url_imagen3.jpg", "url_imagen4.jpg"]
}


- Listar todos los productos

GET - http://localhost:8080/api/products/


- Solicitar un producto por ID:

GET - http://localhost:8080/api/products/:pid  

** Remplazar :pid por el id del producto de MongoDB





- Modificar un producto por ID:

PUT - http://localhost:8080/api/products/:pid

Body: ej
{
    "title": "Producto A actualizado",
    "price": 150,
    "stock": 30
}




- Eliminar un producto por ID:

DELETE - http://localhost:8080/api/products/:pid


█ Manejo de carritos:


- Crear un carrito:

POST - http://localhost:8080/api/carts/


- Listar todos los carritos creados:

GET - http://localhost:8080/api/carts/


- Listar carrito por ID:

GET - http://localhost:8080/api/carts/:CID



- Agregar un producto al carrito:

POST - http://localhost:8080/api/carts/:cid/product/:pid

En body un json con el obj:

{
	    "quantity": N     (Numero a agregar)

}


█ Vistas:

http://localhost:8080/home

http://localhost:8080/realtimeproducts

http://localhost:8080/products

http://localhost:8080/products/:pid

http://localhost:8080/carts

http://localhost:8080/carts/:cid

http://localhost:8080/cartDetail




