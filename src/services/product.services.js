import ProductDaoMongo from "../daos/mongodb/product.dao.js";
const productDao = new ProductDaoMongo();

// import { ProductManager } from "../daos/fs/productManager.js";
// import { __dirname } from "../utils.js";
// const productDao = new ProductManager(__dirname + "/data/products.json");



export const getProducts = async (page, limit, category, sort) => {
    try {
        return await productDao.getProducts(page, limit, category, sort);
    } catch (error) {
        console.log(error);
    }
}

export const getProductById = async (id) => {
    try {
        const product = await productDao.getProductById(id);
        if (!product) return false;
        else return product;
    } catch (error) {
        console.log(error);
    }
}

export const addProduct = async (obj) => {
    try {
        const newProduct = await productDao.addProduct(obj);
        if (!newProduct) return false;
        else return newProduct;
    } catch (error) {
        console.log(error);
    }
}

export const updateProduct = async (id, obj) => {
    try {
        const productUpdated = await productDao.updateProduct(id, obj)
        if (!productUpdated) return false;
        else return productUpdated;
    } catch (error) {
        console.log(error);
    }
}

export const deleteProduct = async (id) => {
    try {
        const productDeleted = await productDao.deleteProduct(id);
        if (!productDeleted) return false;
        else return productDeleted;
    } catch (error) {
        console.log(error);
    }
}