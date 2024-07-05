A continuacion se listaran las instrucciones para utilizar el programa desde insomnia:

- Agregar un producto:

POST - http://localhost:8080/

Body:
{
    "title": "Producto A",
    "description": "Descripción del Producto A",
    "code": "P100",
    "price": 100,
    "status": true,
    "stock": 10,
    "category": "Categoría A",
    "thumbnails": [
        "ruta/imagen1.jpg",
        "ruta/imagen2.jpg"
    ]
}





- Solicitar un producto por ID:

GET - http://localhost:8080/:pid  (Comienzan con 1 y se autoincrementan)





- Modificar un producto por ID:

PUT - http://localhost:8080/:pid  

Body: ej
{
    "title": "Producto A actualizado",
    "price": 150,
    "stock": 30
}




- Eliminar un producto por ID:

DELETE - http://localhost:8080/:pid





- Crear un carrito:

POST - http://localhost:8080/api/carts/





- Agregar un producto determinado desde Product.json a un Carrito, por ID: 

POST - /api/carts/:cid/product/:pid    ( donde :cid es el ID del carrito *Comienzan en 1000 y se autoincrementan*, y :pid es el ID del producto *Comienzan en 1 y se autoincrementan*)

Ej: /api/carts/1000/product/2    (ID carrito: 1000  y  ID producto: 2)