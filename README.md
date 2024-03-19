
# Proyecto final Backend Coderhouse

## Descripción
Proyecto realizado para el curso de Backend, en el que se desarrollo una api de un e-commerce utilizando node.js y express. 

## Cómo utilizar el repositorio
 Para poder utilizar el proyecto, una vez clonado se deben ejecutar los siguentes comandos:
 ```
npm i
npm start
```

Para su correcto funcionamiento es necesario configurar correctamente las siguentes variables de entorno en un archivo `.env `

- `MONGO_URL`: url de la base de dato de mongodb.
- `PORT`: puerto en el cual se quiere levantar el proyecto.
- `PRIVATE_KEY`: key privada para decodificar el token de JWT.
- `TRANSPORT_TYPE`: tipo de transporte para utilizar el logger. "dev || prod".
- `EMAIL`: correo electronico (gmail) desde el cual se enviaran los emails.
- `PASSWORD`: contraseña de appliacion generada por google para poder mandar los mails.
- `TEST_COLLECTION`: variable para poder elegir si usar una colleccion de test, si el valor es "test", o de produccion si el valor el cualquier otro, incluso un string vacio.


## API Reference

#### Crear un producto

```
  POST /api/products
```

Se pasa por body un objeto con la Informacion del producto, por ejemplo:

`{
  "title": "Ejemplo",
  "description": "Producto de ejemplo",
  "price": 1500,
  "code": "Ag01",
  "stock": 15,
  "category": "Ejemplo"
}`

Creara un documento con la informacion que se pasa por body en la base de datos.

### Obtener productos

```
  GET /api/products
```

Llamara a la base de datos y devolvera un array de objetos con todos los productos con paginacion. Tambien se le puede pasar por query los parametros: ` "page", "limit", "category" y "sort" ` para modificar la respuesta.

### Obtener un producto mediante Id
```
  GET /api/products/{id}
```
| Parameter      | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `id` | `string` | **Required**. Id del producto a buscar |

Hace un get a la base de datos pasandole por parametro un id, con el cual buscara y devolvera como respuesta el producto que coincida con ese id generado automaticamente al momento de crear el producto.

### Actualizar un producto
```
  POST /api/products/{id}
```
| Parameter      | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `id` | `string` | **Required**. Id del producto a buscar |

Se hara un post en la base de datos, pasandole por parametro el id del producto a actualizar y por body la nueva informacion del producto como un objeto, de la misma forma que al creearlo. Devolviendo como respuesta el producto actualizado.

### Eliminar un producto
```
  DELETE /api/products/{id}
```

| Parameter      | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `id` | `string` | **Required**. Id del producto a eliminar |

Se pasara por parametros el id del producto que se quiere eliminar y con un metodo delete se eliminara el producto de la base de datos.

### Registrar un usuario
```
  POST /user/registerJwt
```
Se pasara por body un objeto con la informacion del usuario como el siguente:

`{"firstName" : "Ejemplo",
"lastName" : "Ejemplo",
"email" :"ejemplo@gmail.com",
"age": 13,
"password" :"1234"}`

Verificara que no haya un usuario existente con ese correo y de no haberlo generara un documento en la base de datos con la informacion proporcionada. Devolviendo la informacion del usuario creado.
La contraseña de hashea para que sea segura y no se pueda saber.
### Iniciar sesion
```
  POST /user/loginJwt
```

Por medio del body se pasara el email y la contraseña del usuario, la contraseña se hashea y se comprara con la que esta guardada en base de datos, si coincide se considera un inicio de sesion exitoso y se genera un token que se almacena en una cookie. Ese token contiene el id del usuario que se usa en otras rutas para verificar si el usuario esta logueado o comprobar el rol para permitir o negar el acceso.

### Iniciar sesion
```
  POST /user/login
```
Se pasa la informacion del usuario por body al igual que loginJwt pero en vez de generar un token, genera una sesion que guarda informacion del usuario.
### Profile
```
  GET /user/profile
```
Esta ruta con un usuario logueado con sesiones (/login) devuelve informacion basica sobre el usuario, no delicada.

### Registro con github
```
  GET /user/register-github
```

Esta ruta redirecciona al inicio de sesion con github. Una vez iniciada la sesion, si el usuario no se encuentra en la base de datos, se registrara el usuario con los datos de su cuenta de github.

### Profile github
```
  GET /user/github
```
 Para usuarios que hayan iniciado sesion con github, devolvera informacion del usuario.

### Private
```
  GET /user/private
```
Al igual que la ruta de "profile" devuelve informacion no delicada del usuario pero en vez de obtener el id de la sesion, la obtiene del token JWT (es necesario iniciar sesion en la ruta /loginJwt)

### resetPassword
```
  post /user/resetPassword
```

Con un usuario logueado, al llamar a este endpoint, se genera un token temporal permite utilizar el endpoint "/user/updatePassword". Ademas se envia en correo al usuario interesado en modificar la contraseña indicando el link a cual dirigirse para continuar con el cambio.

### updatePassword
```
  PUT /user/updatePassword
```
Una vez generado el token con el endpoint anterior, se verifica que exista y de ser asi, se pasa por body la nueva contraseña como un objeto con la propiedad password con la nueva contraseña como valor. Una vez realizado esto, se envia un mail informando del cambio y se elimina el token para que no se pueda volver a cambiar sin solicitarlo.

### Premium
```
  PUT /user/premium/{id}
```
| Parameter      | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `id` | `string` | **Required**. Id del usuario |

En esta ruta se pasara por parametro el id del usuario al cual se le quiera cambiar el rol de user a premium o de premium a user, los usuarios con rol admin no tienen permitido cambiar el rol.

### DeleteUsers
```
  DELETE /user/deleteUsers
```
En este endpoint que solo pueden utilizar los admin, se eliminaran todos los usuarios que no hayan iniciado sesion en los ultimos dos dias, excepto los administradores.

### getUsers
```
  GET /user/getUsers
```
Tambien utilizable solo para administradores, este endpoint devolvera todos los usuarios que esten registrados en la base de datos.

### CreateCart
```
  POSt /api/carts
```
Creara un carrito (array), este endpoint se utiliza al registrar un usuario, asignandole un carrito.

### GetCartById
```
  GET /api/carts/{id}
```
| Parameter      | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `id` | `string` | **Required**. Id del carrito |

Pasandole por parametro el id, buscara en la coleccion de carritos, un documento con el mismo id y lo devolvera.

### addProdutToCart
```
  POST /api/carts/{idCart}/product/{idProduct}
```
| Parameter      | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `idCart` | `string` | **Required**. Id del carrito |
| `idProduct` | `string` | **Required**. Id del Producto |

En este endpoint, se agregara un producto a un carrito. Pasandole por parametro el id del carrito (idCart) y el id del producto (idProduct).

### DeleteProd
```
  DELETE /api/carts/{idCart}/product/{idProduct}
```

| Parameter      | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `idCart` | `string` | **Required**. Id del carrito |
| `idProduct` | `string` | **Required**. Id del Producto |

Este eliminara el producto que se le pasa por parametro (idProduct) del carrito seleccionado (idCart)

### UpdateQuantity

```
  PUT /api/carts/{idCart}/product/{idProduct}
```

| Parameter      | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `idCart` | `string` | **Required**. Id del carrito |
| `idProduct` | `string` | **Required**. Id del Producto |

Al igual que los endpoints anteriores, se le pasa el id del carrito y del producto a modificar pero tambien se le pasa por body un objeto con la propiedad quantity y en el valor un number que sera la nueva cantidad en el carrito.

### ClearCart
```
  DELETE /user/carts/{idCart}
```
| Parameter      | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `id` | `string` | **Required**. Id del carrito |

Este endpoint, al pasarle el id del carrito, los buscara y una vez lo encuentre vaciara su contenido, dejandolo sin porductos.

### UpdateCart
```
  PUT /user/carts/{idCart}
```
| Parameter      | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `id` | `string` | **Required**. Id del carrito |

Pasandole el id del carrito por parametro y por body un array de objetos con id de productos existentes y cantidad, por ejemplo : 

`[
    {
        "product": "655ae728365f35f30c3e9880",
        "quantity": 3
    },
    {
        "product": "656183817803e0b395793fc6",
        "quantity": 4
    }
]`

Se podra actualizar el carrito remplazando los productos que tenia antes por los pasados por body.

### Ticket
```
  POST /user/carts/{idCart}/purchase
```
| Parameter      | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `id` | `string` | **Required**. Id del carrito |

Este endpoint generara un ticket de compra con los productos que tenga el carrito que se haya pasado por parametro, obteniendo el total de productos y precio total, y la informacion del usuario que compra. Se enviara un correo al usuario comprador.
## Testing

Para correr un test, ejecutar el siguente comando

Endpoint "/user/deleteUsers"  no esta incluido en el test

```
  npm run test
```

