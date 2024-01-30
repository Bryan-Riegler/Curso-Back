import * as service from "../services/productsFake.services.js";
import { errorsDictionary } from "../utils/errorsDictionary.js";

export const createFakeProducts = async (req, res) => {
    try {
        const { cant } = req.query;
        const response = await service.createFakeProducts(cant);
        if (!response) res.status(404).json({ message: errorsDictionary.ERROR_CREATE })
        else res.status(200).json({ products: response })
    } catch (error) {
        next(error);
    }
}

export const getFakeProducts = async (req, res) => {
    try {
        const response = await service.getFakeProducts();
        if (!response) res.status(404).json({ message: errorsDictionary.ERROR_GET_PRODUCT })
        else res.status(200).json({ products: response })
    } catch (error) {
        next(error);
    }
}