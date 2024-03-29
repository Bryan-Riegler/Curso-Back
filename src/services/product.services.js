import ProductDaoMongo from "../daos/mongodb/product.dao.js";
const productDao = new ProductDaoMongo();
import { sendMail } from "./mailing.services.js";
import UserDao from "../daos/mongodb/user.dao.js";
const userDao = new UserDao()
// import { ProductManager } from "../daos/fs/productManager.js";
// import { __dirname } from "../dirname.js";
// const productDao = new ProductManager(__dirname + "/data/products.json");



export const getProducts = async (page, limit, category, sort) => {
    try {
        return await productDao.getProducts(page, limit, category, sort);
    } catch (error) {
        throw new Error(error.message)
    }
}

export const getProductsRender = async () => {
    try {
        return await productDao.getProductsRender();
    } catch (error) {
        throw new Error(error.message)
    }
}

export const getProductById = async (id) => {
    try {
        const product = await productDao.getProductById(id);
        if (!product) return false;
        else return product;
    } catch (error) {
        throw new Error(error.message)
    }
}

export const addProduct = async (obj) => {
    try {
        const newProduct = await productDao.addProduct(obj);
        if (!newProduct) return false;
        else return newProduct;
    } catch (error) {
        throw new Error(error.message)
    }
}

export const updateProduct = async (id, obj) => {
    try {
        const productUpdated = await productDao.updateProduct(id, obj)
        if (!productUpdated) return false;
        else return productUpdated;
    } catch (error) {
        throw new Error(error.message)
    }
}

export const deleteProduct = async (id) => {
    try {
        const prodToDel = await productDao.getProductById(id);
        const { title, owner } = prodToDel;
        if (owner !== "admin") {
            const user = await userDao.findByEmail(owner);
            const firstName = user.firstName
            const email = user.email
            const data = {
                firstName,
                title,
                email
            }
            await sendMail(data, "deleteProd");
        }
        const productDeleted = await productDao.deleteProduct(id);
        if (!productDeleted) return false;
        else return productDeleted;
    } catch (error) {
        throw new Error(error.message)
    }
}