import app from "../../app.js";
import request from "supertest";
import mongoose from "mongoose";
import { fakerES as faker } from "@faker-js/faker";

describe("Test users", () => {
    beforeAll(async () => {
        await mongoose.connection.collections["testusers"].drop();
    });
    test("[POST] /user/registerJwt", async () => {
        const user = {
            firstName: "user",
            lastName: "user",
            email: "bryanriegler1@gmail.com",
            password: "1234",
            age: 123,
        }
        const register = await request(app).post("/user/registerJwt").send(user);
        expect(register.statusCode).toBe(200);
        expect(register.body.msg).toEqual("Register OK");
        expect(register.body.newUser._id).toBeDefined();
        expect(register.body.newUser.firstName).toBe(user.firstName);
        expect(register.body.newUser.lastName).toBe(user.lastName);
        expect(register.body.newUser.email).toBe(user.email);
        expect(register.body.newUser.age).toBe(user.age);

    })

    test("[POST] /user/loginJwt", async () => {
        const userAdmin = {
            firstName: "admin",
            lastName: "admin",
            email: "adminCoder@coder.com",
            password: "1234",
            age: 123,
        }
        const register = await request(app).post("/user/registerJwt").send(userAdmin);
        expect(register.statusCode).toBe(200);
        const userLogin = {
            email: "adminCoder@coder.com",
            password: "1234",
        }
        const login = await request(app).post("/user/loginJwt").send(userLogin)
        expect(login.statusCode).toBe(200);
        expect(login.body.msg).toEqual("login ok");
        expect(login.body.accessToken).toBeDefined();
    })

    test("[PUT] /user/premium/:id", async () => {
        const premium = {
            firstName: "premium",
            lastName: "premium",
            email: "bryanriegler12@gmail.com",
            password: "1234",
            age: 123,
        }
        const regPremium = await request(app).post("/user/registerJwt").send(premium);
        const id = regPremium.body.newUser._id;
        const premiumUser = {
            email: "bryanriegler12@gmail.com",
            password: "1234"
        }
        const loginPremium = await request(app).post("/user/loginJwt").send(premiumUser)
        const token = loginPremium.body.accessToken
        const upgradePremium = await request(app).put(`/user/premium/${id}`).set('Cookie', `Authorization=${token}`);
        expect(upgradePremium.statusCode).toBe(200);
        expect(upgradePremium.body.msg).toEqual("Role updated to premium successfully")


        const userR = {
            firstName: "user",
            lastName: "user",
            email: "bryanriegler11@gmail.com",
            password: "1234",
            age: 123,
        }
        const regUser = await request(app).post("/user/registerJwt").send(userR);
        const idUser = regUser.body.newUser._id
        const user = {
            email: "bryanriegler11@gmail.com",
            password: "1234"
        }
        const login = await request(app).post("/user/loginJwt").send(user)
        const tokenUser = login.body.accessToken
        await request(app).put(`/user/premium/${idUser}`).set('Cookie', `Authorization=${tokenUser}`);
        const upgradeUser = await request(app).put(`/user/premium/${idUser}`).set('Cookie', `Authorization=${tokenUser}`);
        expect(upgradeUser.statusCode).toBe(200);
        expect(upgradeUser.body.msg).toEqual("Role updated to user successfully")
    }, 10000)

    test("[GET] /user/private", async () => {
        const user = {
            email: "adminCoder@coder.com",
            password: "1234"
        }
        const login = await request(app).post("/user/loginJwt").send(user)
        const token = login.body.accessToken
        const getPrivate = await request(app).get("/user/private").set('Cookie', `Authorization=${token}`);
        expect(getPrivate.statusCode).toBe(200);
        expect(getPrivate.body.status).toBe("success");
        expect(getPrivate.body.userData.email).toEqual(user.email);
    })

    test("[POST] /user/resetPassword", async () => {
        const user = {
            email: "bryanriegler11@gmail.com",
            password: "1234"
        }
        const login = await request(app).post("/user/loginJwt").send(user)
        const token = login.body.accessToken
        const resetPassword = await request(app).post("/user/resetPassword").set('Cookie', `Authorization=${token}`);
        expect(resetPassword.statusCode).toBe(200);
        expect(resetPassword.body.msg).toEqual("Reset password email send")
    })

    test("[PUT] /user/updatePassword", async () => {
        const user = {
            email: "bryanriegler11@gmail.com",
            password: "1234"
        }
        const login = await request(app).post("/user/loginJwt").send(user)
        const token = login.body.accessToken
        const resetPassword = await request(app).post("/user/resetPassword").set('Cookie', `Authorization=${token}`);
        const setCookieHeader = resetPassword.header['set-cookie'];
        const tokenPass = setCookieHeader.find(cookie => cookie.startsWith('tokenPass='));
        const newPass = "12345"
        const updatePassword = await request(app).put("/user/updatePassword").send(newPass).set('Cookie', `Authorization=${token}; tokenPass=${tokenPass}`)
        expect(updatePassword.statusCode).toBe(200);
        expect(updatePassword.body.msg).toEqual("Password updated successfully");
    }, 20000)
})

describe("Test productos", () => {
    beforeAll(async () => {
        await mongoose.connection.collections["testproducts"].drop();
    })

    test("[POST] /api/products", async () => {
        const user = {
            email: "adminCoder@coder.com", //usuario habilitado a crear productos
            password: "1234"
        }
        const login = await request(app).post("/user/loginJwt").send(user);
        const token = login.body.accessToken;

        const product = {
            title: faker.commerce.product(),
            description: faker.commerce.productDescription(),
            price: faker.number.int({ min: 10, max: 10000 }),
            code: faker.string.alphanumeric(5),
            stock: faker.number.int(100),
            category: faker.commerce.department(),
            status: faker.datatype.boolean({ probability: 0.6 })
        }
        const response = await request(app).post("/api/products").send(product).set('Cookie', `Authorization=${token}`);
        const id = response.body._id;
        const title = response.body.title;
        const description = response.body.description;
        const price = response.body.price;
        const code = response.body.code;
        const stock = response.body.stock;
        const category = response.body.category
        const status = response.body.status

        expect(id).toBeDefined();
        expect(title).toBe(product.title);
        expect(description).toBe(product.description);
        expect(price).toBe(product.price);
        expect(code).toBe(product.code);
        expect(stock).toBe(product.stock);
        expect(category).toBe(product.category);
        expect(status).toBe(product.status);
        expect(response.statusCode).toBe(200)

        const userUnauthorized = {
            email: "bryanriegler1@gmail.com", //usuario no habilitado a crear productos
            password: "1234"
        }
        const loginError = await request(app).post("/user/loginJwt").send(userUnauthorized);
        const invalidToken = loginError.body.accessToken

        const product2 = {
            title: faker.commerce.product(),
            description: faker.commerce.productDescription(),
            price: faker.number.int({ min: 10, max: 10000 }),
            code: faker.string.alphanumeric(5),
            stock: faker.number.int(100),
            category: faker.commerce.department(),
            status: faker.datatype.boolean({ probability: 0.6 })
        }

        const response2 = await request(app).post("/api/products").send(product2).set('Cookie', `Authorization=${invalidToken}`);
        const msgError = 'Unauthorized to create products'
        expect(response2.body.msg).toEqual(msgError)
        expect(response2.status).toBe(403)

    })

    test("[GET] /api/products", async () => {
        const response = await request(app).get("/api/products");
        expect(response.statusCode).toBe(200);
        expect(response.body.payload).toHaveLength(1);
        expect(response.body.payload).toBeInstanceOf(Array);
    })

    test("[GET] /api/products/:id", async () => {
        const user = {
            email: "adminCoder@coder.com", //usuario habilitado a crear productos
            password: "1234"
        }
        const login = await request(app).post("/user/loginJwt").send(user);
        const token = login.body.accessToken;

        const product = {
            title: faker.commerce.product(),
            description: faker.commerce.productDescription(),
            price: faker.number.int({ min: 10, max: 10000 }),
            code: faker.string.alphanumeric(5),
            stock: faker.number.int(100),
            category: faker.commerce.department(),
            status: faker.datatype.boolean({ probability: 0.6 })
        }
        const response = await request(app).post("/api/products").send(product).set('Cookie', `Authorization=${token}`);
        const id = response.body._id
        expect(id).toBeDefined();
        const responseGet = await request(app).get(`/api/products/${id}`);
        expect(responseGet.statusCode).toBe(200);
        expect(responseGet.body.title).toEqual(product.title);
        expect(responseGet.body.description).toEqual(product.description);
        expect(responseGet.body.price).toEqual(product.price);
        expect(responseGet.body.code).toEqual(product.code);
        expect(responseGet.body.stock).toEqual(product.stock);
        expect(responseGet.body.category).toEqual(product.category);
        expect(responseGet.body.status).toEqual(product.status);

        const invalidId = "65e55723f0f987bcbe8c4a3d"
        const responseError = await request(app).get(`/api/products/${invalidId}`);
        const msgError = "Not found"
        expect(responseError.body.message).toEqual(msgError)
        expect(responseError.statusCode).toBe(404)
    })

    test("[PUT] /api/products/:id", async () => {
        const user = {
            email: "adminCoder@coder.com", //usuario habilitado a crear productos
            password: "1234"
        }
        const login = await request(app).post("/user/loginJwt").send(user);
        const token = login.body.accessToken;

        const product = {
            title: faker.commerce.product(),
            description: faker.commerce.productDescription(),
            price: faker.number.int({ min: 10, max: 10000 }),
            code: faker.string.alphanumeric(5),
            stock: faker.number.int(100),
            category: faker.commerce.department(),
            status: faker.datatype.boolean({ probability: 0.6 })
        }
        const response = await request(app).post("/api/products").send(product).set('Cookie', `Authorization=${token}`);
        const id = response.body._id
        expect(id).toBeDefined();

        const UpdProduct = {
            title: "actualizado",
            description: faker.commerce.productDescription(),
            price: faker.number.int({ min: 10, max: 10000 }),
            code: faker.string.alphanumeric(5),
            stock: faker.number.int(100),
            category: faker.commerce.department(),
            status: faker.datatype.boolean({ probability: 0.6 })
        }
        const responsePut = await request(app).put(`/api/products/${id}`).send(UpdProduct).set('Cookie', `Authorization=${token}`)
        expect(responsePut.statusCode).toBe(200);
        expect(responsePut.body.title).toEqual(UpdProduct.title);
        expect(responsePut.body.description).toEqual(UpdProduct.description);
        expect(responsePut.body.price).toEqual(UpdProduct.price);
        expect(responsePut.body.code).toEqual(UpdProduct.code);
        expect(responsePut.body.stock).toEqual(UpdProduct.stock);
        expect(responsePut.body.category).toEqual(UpdProduct.category);
        expect(responsePut.body.status).toEqual(UpdProduct.status);


        const userUnauthorized = {
            email: "bryanriegler1@gmail.com", //usuario no habilitado a crear productos
            password: "1234"
        }
        const loginError = await request(app).post("/user/loginJwt").send(userUnauthorized);
        const invalidToken = loginError.body.accessToken

        const product2 = {
            title: faker.commerce.product(),
            description: faker.commerce.productDescription(),
            price: faker.number.int({ min: 10, max: 10000 }),
            code: faker.string.alphanumeric(5),
            stock: faker.number.int(100),
            category: faker.commerce.department(),
            status: faker.datatype.boolean({ probability: 0.6 })
        }

        const response2 = await request(app).put(`/api/products/${id}`).send(product2).set('Cookie', `Authorization=${invalidToken}`);
        const msgError = 'Acceso no autorizado'
        expect(response2.body.error).toEqual(msgError)
        expect(response2.status).toBe(403)
    })

    test("[DELETE] /api/products/:id", async () => {
        const user = {
            email: "adminCoder@coder.com", //usuario habilitado a crear productos
            password: "1234"
        }
        const login = await request(app).post("/user/loginJwt").send(user);
        const token = login.body.accessToken;

        const product = {
            title: faker.commerce.product(),
            description: faker.commerce.productDescription(),
            price: faker.number.int({ min: 10, max: 10000 }),
            code: faker.string.alphanumeric(5),
            stock: faker.number.int(100),
            category: faker.commerce.department(),
            status: faker.datatype.boolean({ probability: 0.6 })
        }
        const response = await request(app).post("/api/products").send(product).set('Cookie', `Authorization=${token}`);
        const id = response.body._id
        expect(id).toBeDefined();

        const userUnauthorized = {
            email: "bryanriegler1@gmail.com", //usuario no habilitado a crear productos
            password: "1234"
        }
        const loginUnauthorized = await request(app).post("/user/loginJwt").send(userUnauthorized);
        const tokenUnauthorized = loginUnauthorized.body.accessToken
        const responseUnauthorized = await request(app).delete(`/api/products/${id}`).set('Cookie', `Authorization=${tokenUnauthorized}`);
        const msgUnauthorized = "Unaothorized to delete products"
        expect(responseUnauthorized.body.msg).toEqual(msgUnauthorized)
        expect(responseUnauthorized.statusCode).toBe(403)

        const userPremium = {
            email: "bryanriegler12@gmail.com", //usuario premium
            password: "1234"
        }
        const LoginNotOwner = await request(app).post("/user/loginJwt").send(userPremium)
        const tokenPremium = LoginNotOwner.body.accessToken
        const responseNotOwner = await request(app).delete(`/api/products/${id}`).set('Cookie', `Authorization=${tokenPremium}`);
        const msgNotOwner = "You are not the owner of this product"
        expect(responseNotOwner.body.msg).toEqual(msgNotOwner)
        expect(responseNotOwner.statusCode).toBe(403);

        const responseDel = await request(app).delete(`/api/products/${id}`).set('Cookie', `Authorization=${token}`);
        expect(responseDel.statusCode).toBe(200);
        expect(responseDel.body.msg).toBe(`Product with id ${id} was deleted successfully`)
        const responseGet = await request(app).get(`/api/products/${id}`);
        expect(responseGet.statusCode).toBe(404);
        const msgError = "Not found";
        expect(responseGet.body.message).toEqual(msgError)

        const invalidId = "65e5de9a4ed0d99068d73cab"
        const responseDelFail = await request(app).delete(`/api/products/${invalidId}`).set('Cookie', `Authorization=${token}`);
        expect(responseDelFail.body.msg).toEqual(msgError)
        expect(responseDelFail.statusCode).toBe(404);
    })

})

describe("Test carritos", () => {
    beforeAll(async () => {
        await mongoose.connection.collections["testcarts"].drop();
    })

    test("[GET] /api/carts/:id", async () => {
        const newCart = await request(app).post("/api/carts")
        const id = newCart.body._id
        const getCart = await request(app).get(`/api/carts/${id}`)
        expect(id).toBeDefined()
        expect(getCart.body.products).toBeInstanceOf(Array)
        expect(getCart.statusCode).toBe(200)

        const invalidId = "65e5de9a4ed0d99068d73cab"
        const getCartFail = await request(app).get(`/api/carts/${invalidId}`);
        expect(getCartFail.statusCode).toBe(404)
        expect(getCartFail.body.message).toEqual("Not found")
    })

    test("[POST] /api/carts/:idCart/product/:idProduct", async () => {
        const userCreate = {
            email: "adminCoder@coder.com", //Usuario habilitado a crear productos
            password: "1234"
        }
        const login = await request(app).post("/user/loginJwt").send(userCreate);
        const token = login.body.accessToken;

        const product = {
            title: faker.commerce.product(),
            description: faker.commerce.productDescription(),
            price: faker.number.int({ min: 10, max: 10000 }),
            code: faker.string.alphanumeric(5),
            stock: faker.number.int(100),
            category: faker.commerce.department(),
            status: faker.datatype.boolean({ probability: 0.6 })
        }
        const response = await request(app).post("/api/products").send(product).set('Cookie', `Authorization=${token}`);
        const idProduct = response.body._id
        const newCartUnauthorized = await request(app).post("/api/carts").set('Cookie', `Authorization=${token}`)
        const idCartUnauthorized = newCartUnauthorized.body._id
        const addToCartUnauthorized = await request(app).post(`/api/carts/${idCartUnauthorized}/product/${idProduct}`).set('Cookie', `Authorization=${token}`)
        expect(addToCartUnauthorized.statusCode).toBe(403);


        const user = {
            email: "bryanriegler1@gmail.com", //usuario habilitado a agregar productos al carrito (User o Premium si el producto no es suyo)
            password: "1234"
        }
        const loginUser = await request(app).post("/user/loginJwt").send(user);
        const tokenUser = loginUser.body.accessToken;

        const newCart = await request(app).post("/api/carts").set('Cookie', `Authorization=${tokenUser}`)
        const idCart = newCart.body._id
        const addToCart = await request(app).post(`/api/carts/${idCart}/product/${idProduct}`).set('Cookie', `Authorization=${tokenUser}`)
        expect(addToCart.statusCode).toBe(200)
        expect(addToCart.body.msg).toEqual(`Product with id ${idProduct} added to cart ${idCart}`)
    })

    test("[DELETE] /api/carts/:idCart/product/:idProduct", async () => {
        const userCreate = {
            email: "adminCoder@coder.com", //Usuario habilitado a crear productos
            password: "1234"
        }
        const login = await request(app).post("/user/loginJwt").send(userCreate);
        const token = login.body.accessToken;

        const product = {
            title: faker.commerce.product(),
            description: faker.commerce.productDescription(),
            price: faker.number.int({ min: 10, max: 10000 }),
            code: faker.string.alphanumeric(5),
            stock: faker.number.int(100),
            category: faker.commerce.department(),
            status: faker.datatype.boolean({ probability: 0.6 })
        }
        const response = await request(app).post("/api/products").send(product).set('Cookie', `Authorization=${token}`);
        expect(response.statusCode).toEqual(200);
        const idProduct = response.body._id
        expect(idProduct).toBeDefined();

        const user = {
            email: "bryanriegler1@gmail.com", //usuario habilitado a agregar productos al carrito (User o Premium si el producto no es suyo)
            password: "1234"
        }
        const loginUser = await request(app).post("/user/loginJwt").send(user);
        const tokenUser = loginUser.body.accessToken;
        const newCart = await request(app).post("/api/carts").set('Cookie', `Authorization=${tokenUser}`)
        const idCart = newCart.body._id
        const addToCart = await request(app).post(`/api/carts/${idCart}/product/${idProduct}`).set('Cookie', `Authorization=${tokenUser}`)
        expect(addToCart.statusCode).toBe(200)
        expect(addToCart.body.msg).toEqual(`Product with id ${idProduct} added to cart ${idCart}`)

        const DelProdFromCart = await request(app).delete(`/api/carts/${idCart}/product/${idProduct}`).set('Cookie', `Authorization=${tokenUser}`)
        expect(DelProdFromCart.statusCode).toBe(200)
        expect(DelProdFromCart.body.message).toEqual(`Product with id ${idProduct} deleted from cart ${idCart}`)

        const updtCart = await request(app).get(`/api/carts/${idCart}`).set('Cookie', `Authorization=${tokenUser}`)
        const deleteProd = idProduct
        const products = updtCart.body.products.map(product => product.product._id);
        expect(products).not.toContain(deleteProd)
    })

    test("[PUT] /api/carts/:idCart/product/:idProduct", async () => {
        const userCreate = {
            email: "adminCoder@coder.com", //Usuario habilitado a crear productos
            password: "1234"
        }
        const login = await request(app).post("/user/loginJwt").send(userCreate);
        const token = login.body.accessToken;

        const product = {
            title: faker.commerce.product(),
            description: faker.commerce.productDescription(),
            price: faker.number.int({ min: 10, max: 10000 }),
            code: faker.string.alphanumeric(5),
            stock: faker.number.int(100),
            category: faker.commerce.department(),
            status: faker.datatype.boolean({ probability: 0.6 })
        }
        const response = await request(app).post("/api/products").send(product).set('Cookie', `Authorization=${token}`);
        expect(response.statusCode).toEqual(200);
        const idProduct = response.body._id
        expect(idProduct).toBeDefined();

        const user = {
            email: "bryanriegler1@gmail.com", //usuario habilitado a agregar productos al carrito (User o Premium si el producto no es suyo)
            password: "1234"
        }
        const loginUser = await request(app).post("/user/loginJwt").send(user);
        const tokenUser = loginUser.body.accessToken;
        const newCart = await request(app).post("/api/carts").set('Cookie', `Authorization=${tokenUser}`)
        const idCart = newCart.body._id
        const addToCart = await request(app).post(`/api/carts/${idCart}/product/${idProduct}`).set('Cookie', `Authorization=${tokenUser}`)
        expect(addToCart.statusCode).toBe(200)
        expect(addToCart.body.msg).toEqual(`Product with id ${idProduct} added to cart ${idCart}`)

        const quantity = {
            quantity: 12
        }
        const updtQuantity = await request(app).put(`/api/carts/${idCart}/product/${idProduct}`).send(quantity)
        const msg = "Quantity changed successfully"
        expect(updtQuantity.statusCode).toBe(200)
        expect(updtQuantity.body.message).toEqual(msg)
    })

    test("[DELETE] /api/carts/:idCart", async () => {
        const userCreate = {
            email: "adminCoder@coder.com", //Usuario habilitado a crear productos
            password: "1234"
        }
        const login = await request(app).post("/user/loginJwt").send(userCreate);
        const token = login.body.accessToken;

        const product = {
            title: faker.commerce.product(),
            description: faker.commerce.productDescription(),
            price: faker.number.int({ min: 10, max: 10000 }),
            code: faker.string.alphanumeric(5),
            stock: faker.number.int(100),
            category: faker.commerce.department(),
            status: faker.datatype.boolean({ probability: 0.6 })
        }
        const response = await request(app).post("/api/products").send(product).set('Cookie', `Authorization=${token}`);
        expect(response.statusCode).toEqual(200);
        const idProduct = response.body._id
        expect(idProduct).toBeDefined();

        const user = {
            email: "bryanriegler1@gmail.com", //usuario habilitado a agregar productos al carrito (User o Premium si el producto no es suyo)
            password: "1234"
        }
        const loginUser = await request(app).post("/user/loginJwt").send(user);
        const tokenUser = loginUser.body.accessToken;
        const newCart = await request(app).post("/api/carts").set('Cookie', `Authorization=${tokenUser}`)
        const idCart = newCart.body._id
        const addToCart = await request(app).post(`/api/carts/${idCart}/product/${idProduct}`).set('Cookie', `Authorization=${tokenUser}`)
        expect(addToCart.statusCode).toBe(200)
        expect(addToCart.body.msg).toEqual(`Product with id ${idProduct} added to cart ${idCart}`)

        const clearCart = await request(app).delete(`/api/carts/${idCart}`)
        expect(clearCart.statusCode).toBe(200)
        expect(clearCart.body.products).toHaveLength(0)

        const invalidId = "65e6a46f87b420810f5dc292"
        const noClearCart = await request(app).delete(`/api/carts/${invalidId}`)
        expect(noClearCart.statusCode).toBe(404)
        expect(noClearCart.body.message).toBe('Error deleting')
    })

    test("[PUT] /api/carts/:idCart", async () => {
        const userCreate = {
            email: "adminCoder@coder.com", //Usuario habilitado a crear productos
            password: "1234"
        }
        const login = await request(app).post("/user/loginJwt").send(userCreate);
        const token = login.body.accessToken;

        const product = {
            title: faker.commerce.product(),
            description: faker.commerce.productDescription(),
            price: faker.number.int({ min: 10, max: 10000 }),
            code: faker.string.alphanumeric(5),
            stock: faker.number.int(100),
            category: faker.commerce.department(),
            status: faker.datatype.boolean({ probability: 0.6 })
        }
        const response = await request(app).post("/api/products").send(product).set('Cookie', `Authorization=${token}`);
        expect(response.statusCode).toEqual(200);
        const idProduct = response.body._id
        expect(idProduct).toBeDefined();

        const product2 = {
            title: faker.commerce.product(),
            description: faker.commerce.productDescription(),
            price: faker.number.int({ min: 10, max: 10000 }),
            code: faker.string.alphanumeric(5),
            stock: faker.number.int(100),
            category: faker.commerce.department(),
            status: faker.datatype.boolean({ probability: 0.6 })
        }
        const response2 = await request(app).post("/api/products").send(product2).set('Cookie', `Authorization=${token}`);
        expect(response2.statusCode).toBe(200);
        const idProduct2 = response2.body._id
        expect(idProduct2).toBeDefined()
        const prodUpd = [
            {
                product: idProduct2,
                quantity: 2
            }
        ]


        const user = {
            email: "bryanriegler1@gmail.com", //usuario habilitado a agregar productos al carrito (User o Premium si el producto no es suyo)
            password: "1234"
        }
        const loginUser = await request(app).post("/user/loginJwt").send(user);
        const tokenUser = loginUser.body.accessToken;
        const newCart = await request(app).post("/api/carts").set('Cookie', `Authorization=${tokenUser}`)
        const idCart = newCart.body._id
        const addToCart = await request(app).post(`/api/carts/${idCart}/product/${idProduct}`).set('Cookie', `Authorization=${tokenUser}`)
        expect(addToCart.statusCode).toBe(200)
        expect(addToCart.body.msg).toEqual(`Product with id ${idProduct} added to cart ${idCart}`)

        const updtCart = await request(app).put(`/api/carts/${idCart}`).send(prodUpd)
        expect(updtCart.statusCode).toBe(200);
        expect(updtCart.body.products.quantity).toBe(prodUpd.quantity)
        expect(updtCart.body.products.product).toEqual(prodUpd.product)
    })

    test("[POST] /api/carts/:cartsId/purchase", async () => {
        const userCreate = {
            email: "adminCoder@coder.com", //Usuario habilitado a crear productos
            password: "1234"
        }
        const login = await request(app).post("/user/loginJwt").send(userCreate);
        const token = login.body.accessToken;

        const product = {
            title: faker.commerce.product(),
            description: faker.commerce.productDescription(),
            price: faker.number.int({ min: 10, max: 10000 }),
            code: faker.string.alphanumeric(5),
            stock: faker.number.int(100),
            category: faker.commerce.department(),
            status: faker.datatype.boolean({ probability: 0.6 })
        }
        const response = await request(app).post("/api/products").send(product).set('Cookie', `Authorization=${token}`);
        expect(response.statusCode).toEqual(200);
        const idProduct = response.body._id
        expect(idProduct).toBeDefined();

        const user = {
            email: "bryanriegler1@gmail.com", //usuario habilitado a agregar productos al carrito (User o Premium si el producto no es suyo)
            password: "1234"
        }
        const loginUser = await request(app).post("/user/loginJwt").send(user);
        const tokenUser = loginUser.body.accessToken;
        const newCart = await request(app).post("/api/carts").set('Cookie', `Authorization=${tokenUser}`)
        const idCart = newCart.body._id
        const addToCart = await request(app).post(`/api/carts/${idCart}/product/${idProduct}`).set('Cookie', `Authorization=${tokenUser}`)
        expect(addToCart.statusCode).toBe(200)
        expect(addToCart.body.msg).toEqual(`Product with id ${idProduct} added to cart ${idCart}`)

        const createTicket = await request(app).post(`/api/carts/${idCart}/purchase`).set('Cookie', `Authorization=${tokenUser}`)
        expect(createTicket.statusCode).toBe(200);
        expect(createTicket.body.msg).toEqual('ticket created successfully');

    })
})

