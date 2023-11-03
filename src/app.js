import express from "express";
import productRouter from "./routes/product.router.js";
import cartRouter from "./routes/cart.router.js";
import { __dirname } from "./utils.js";
import handlebars from "express-handlebars";
import viewRouter from "./routes/views.router.js";
import { Server } from "socket.io";
import { ProductManager } from "./manager/productManager.js";
const productManager = new ProductManager("./src/data/products.json");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'))

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + '/views');
app.set("view engine", "handlebars");


app.use("/api/products", productRouter)
app.use("/api/carts", cartRouter);
app.use("/", viewRouter);

const port = 8080

const httpServer = app.listen(port, () => console.log(`localhost:${port}`));

const socketServer = new Server(httpServer);

socketServer.on("connection", async (socket) => {
    console.log(`conected ${socket.id}`)
    socket.emit("products", await productManager.getProducts());

    socket.on("addProduct", async (product) => {
        await productManager.addProduct(product);
        socketServer.emit("products", await productManager.getProducts());
    })

    socket.on("selectProduct", async (productId) => {
        await productManager.deleteProduct(Number(productId));
        socketServer.emit("products", await productManager.getProducts());
    })
})