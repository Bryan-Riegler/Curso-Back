import fs from 'fs';
import mongoose from 'mongoose';


export class CartManager {
    constructor(path) {
        this.path = path;
    }

    async getCarts() {
        try {
            if (fs.existsSync(this.path)) {
                const cartJSON = await fs.promises.readFile(this.path, "utf-8")
                return JSON.parse(cartJSON);
            } else return [];
        } catch (error) {
            console.log(error);
        }
    }

    async getCartById(id) {
        try {
            const carts = await this.getCarts();
            const cart = carts.find(cart => cart.id === Number(id));
            if (!cart) return false;
            return cart;
        } catch (error) {
            console.log(error);
        }
    }

    async #getMaxId() {
        let maxId = 0;
        const carts = await this.getCarts();
        carts.map((cart) => {
            if (cart.id > maxId) maxId = cart.id;
        })
        return maxId;
    }

    async createCart() {
        try {
            const cart = {
                id: await this.#getMaxId() + 1,
                products: []
            }
            const newCart = await this.getCarts();
            newCart.push(cart);
            await fs.promises.writeFile(this.path, JSON.stringify(newCart));
            return cart;
        } catch (error) {
            console.log(error);
        }
    }

    async addProductToCart(idCart, idProduct) {
        try {
            const carts = await this.getCarts();

            const existCart = carts.find(cart => cart.id === Number(idCart));
            if (existCart) {
                const existProdInCart = existCart.products.find(product => product.product === Number(idProduct));
                if (existProdInCart) {
                    existProdInCart.quantity += 1;
                } else {
                    const product = {
                        product: Number(idProduct),
                        quantity: 1
                    };
                    existCart.products.push(product);
                }
                await fs.promises.writeFile(this.path, JSON.stringify(carts));
                return existCart;
            }

        } catch (error) {
            console.log(error);
        }
    }
}