import fs from 'fs';

export class ProductManager {
    constructor(path) {
        this.path = path;
    }

    async getProducts() {
        try {
            if (fs.existsSync(this.path)) {
                const productsJSON = await fs.promises.readFile(this.path, "utf-8");
                return JSON.parse(productsJSON);
            } else return [];
        } catch (error) {
            console.log(error);
        }
    }

    async getProductById(id) {
        try {
            const products = await this.getProducts();
            const product = products.find((product) => product.id === id);
            if (!product) {
                return false;
            } else return product;
        } catch (error) {
            console.log(error);
        }
    }

    async #getMaxId() {
        let maxId = 0;
        const products = await this.getProducts();
        products.map((prod) => {
            if (prod.id > maxId) maxId = prod.id;
        });
        return maxId;
    }

    async addProduct(obj) {
        try {
            const products = await this.getProducts();
            const product = {
                id: (await this.#getMaxId()) + 1,
                status: true,
                ...obj,
            };
            products.push(product);
            await fs.promises.writeFile(this.path, JSON.stringify(products));
            return product;
        } catch (error) {
            console.log(error);
        }


    }
    async updateProduct(obj, id) {
        try {
            const products = await this.getProducts();
            const productIndex = products.findIndex((product) => product.id === id)

            if (productIndex === -1) {
                return false;
            } else {
                const updatedProduct = { ...obj, id };
                products[productIndex] = updatedProduct;
            }


            await fs.promises.writeFile(this.path, JSON.stringify(products));
        } catch (error) {
            console.log(error);
        }

    }

    async deleteProduct(id) {
        try {
            const products = await this.getProducts();
            if (products.length < 0) return false;
            const newArray = products.filter(p => p.id !== id);
            await fs.promises.writeFile(this.path, JSON.stringify(newArray));
        } catch (error) {
            console.log(error);
        }
    }
}

