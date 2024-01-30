import { FakeModel } from "../daos/mongodb/models/productFakes.model.js";
import { generateProducts } from "../utils/fakeProducts.js";

export const createFakeProducts = async (cant = 100) => {
    try {
        const productsArray = []
        for (let i = 0; i < cant; i++) {
            const product = generateProducts();
            productsArray.push(product);
        }
        const products = await FakeModel.create(productsArray)
        return products;
    } catch (error) {
        throw new Error(error.message)
    }
}

export const getFakeProducts = async () => {
    try {
        const products = await FakeModel.find({});
        return products;
    } catch (error) {
        throw new Error(error.message)
    }
}