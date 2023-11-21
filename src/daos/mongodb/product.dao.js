import { ProductModel } from "./models/product.model.js";

export default class ProductDaoMongo {

    async getProducts() {
        try {
            const response = await ProductModel.find({});
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    async getProductById(id) {
        try {
            const response = await ProductModel.findById(id);
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    async addProduct(obj) {
        try {
            const product = {
                status: true,
                ...obj
            }
            const response = await ProductModel.create(product);
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    async updateProduct(id, obj) {
        try {
            const response = await ProductModel.findByIdAndUpdate(id, obj, { new: true });
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    async deleteProduct(id) {
        try {
            const response = await ProductModel.findByIdAndDelete(id);
            return response;
        } catch (error) {
            console.log(error)
        }
    }
}