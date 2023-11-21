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
            const product = products.find((product) => product.id === Number(id));
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
    async updateProduct(id, obj) {
        try {
            const products = await this.getProducts();
            const productIndex = products.findIndex((product) => product.id === Number(id));

            if (productIndex === -1) {
                return false;
            } else {
                const updatedProduct = { ...obj, id: Number(id) };
                products[productIndex] = updatedProduct;

                await fs.promises.writeFile(this.path, JSON.stringify(products));
                return updatedProduct;
            }


        } catch (error) {
            console.log(error);
            return false;
        }

    }

    async deleteProduct(id) {
        try {
            const products = await this.getProducts();

            const productToDelete = products.find(p => p.id === Number(id));
            if (!productToDelete) {
                return false;
            }

            const newArray = products.filter(p => p.id !== Number(id));
            await fs.promises.writeFile(this.path, JSON.stringify(newArray));
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }
}

