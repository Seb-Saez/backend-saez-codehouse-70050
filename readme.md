A continuacion se listaran las instrucciones para utilizar el programa desde insomnia:

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





- Solicitar un producto por ID:

GET - http://localhost:8080/api/products/:pid  (Comienzan con 1 y se autoincrementan)





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




- Crear un carrito:

POST - http://localhost:8080/api/carts/





- Agregar un producto determinado desde Product.json a un Carrito, por ID: 

POST - /api/carts/:cid/product/:pid    ( donde :cid es el ID del carrito *Comienzan en 1000 y se autoincrementan*, y :pid es el ID del producto *Comienzan en 1 y se autoincrementan*)

Ej: /api/carts/1000/product/2    (ID carrito: 1000  y  ID producto: 2)