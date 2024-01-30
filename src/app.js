import "dotenv/config"
import "./db/database.js";
import express from "express";
import cookieParser from "cookie-parser";
import session from "express-session";
import { url } from "./db/database.js";
import MongoStore from "connect-mongo";
import productRouter from "./routes/product.router.js";
import cartRouter from "./routes/cart.router.js";
import { __dirname } from "./dirname.js";
import handlebars from "express-handlebars";
import viewRouter from "./routes/views.router.js";
import userRouter from "./routes/user.router.js";
import fakeRouter from "./routes/fake.router.js";
import { Server } from "socket.io";
import * as service from "./services/chat.services.js"
import { errorHandler } from "./middlewares/errorHandler.js";
import passport from "passport";
import './passport/github-strategy.js'

const app = express();
app.use(cookieParser());

const mongoStoreOptions = {
    store: MongoStore.create({
        mongoUrl: url,
        ttl: 60
    }),
    secret: "1234",
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 60000,
        sameSite: "lax",
        secure: false,
    },
};


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + '/views');
app.set("view engine", "handlebars");

app.use(session(mongoStoreOptions))

app.use(passport.initialize());
app.use(passport.session());

app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use("/", viewRouter);
app.use("/user", userRouter);
app.use("/api/fake", fakeRouter);
app.use(errorHandler)

const port = process.env.PORT

const httpServer = app.listen(port, () => console.log(`localhost:${port}`));

const socketServer = new Server(httpServer);

socketServer.on("connection", async (socket) => {
    console.log(`conected ${socket.id}`)
    // socket.emit("products", await productManager.getProducts());

    socket.on("addProduct", async (product) => {
        await productManager.addProduct(product);
        socketServer.emit("products", await productManager.getProducts());
    })

    socket.on("selectProduct", async (productId) => {
        await productManager.deleteProduct(Number(productId));
        socketServer.emit("products", await productManager.getProducts());
    })

    socketServer.emit("messages", await service.getAll());

    socket.on("disconnect", () => console.log(`user disconnected ${socket.id}`));

    socket.on("newUser", (user) => console.log(`${user} inicio sesion`))

    socket.on("chat:message", async (msg) => {
        await service.createMessage(msg);
        socketServer.emit("messages", await service.getAll());
    })

    socket.on("newUser", (user) => {
        socket.broadcast.emit("newUser", user);
    })

    socket.on("chat:typing", (user) => {
        socket.broadcast.emit("chat:typing", user);
    })
})