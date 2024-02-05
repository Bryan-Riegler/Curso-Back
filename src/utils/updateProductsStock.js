import { ProductModel } from "../daos/mongodb/models/product.model.js";
import { logger } from "./logger.js"

export const updateProductsStock = async (productsToUpdateStock) => {
    try {
        const updatePromises = productsToUpdateStock.map(async (productUpdate) => {
            const { productId, quantity } = productUpdate;

            const product = await ProductModel.findById(productId);

            if (!product) {
                logger.error("Product not found");
                return false;
            };

            product.stock -= quantity;

            await product.save();
            return true;
        })

        await Promise.all(updatePromises);

        return true;
    } catch (error) {
        logger.error(error);
    }
}