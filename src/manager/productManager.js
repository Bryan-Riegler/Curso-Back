import fs from 'fs';

export class ProductManager {
    constructor() {
        this.path = "./products.json";
        this.id = 0;
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

    async addProduct(title, description, price, thumbnail, code, stock) {
        try {
            const products = await this.getProducts()
            const existingProduct = products.find((product) => product.code === code);

            if (!existingProduct && title !== "" && description !== "" && price !== "" && thumbnail !== "" && code !== "" && stock !== "") {
                const newProduct = {
                    id: this.id++,
                    title,
                    description,
                    price,
                    thumbnail,
                    code,
                    stock
                };
                products.push({ ...newProduct });
                await fs.promises.writeFile(this.path, JSON.stringify(products));
                return newProduct;
            } else return `Complete all fields or change the code`;
        } catch (error) {
            console.log(error);
        }


    }
    async updateProduct(id, updatedProductData) {
        try {
            const products = await this.getProducts();
            const productIndex = products.findIndex((product) => product.id === id)

            if (productIndex === -1) {
                return `Product not found`
            }

            const updatedProduct = { ...products[productIndex], ...updatedProductData };
            products[productIndex] = updatedProduct;

            await fs.promises.writeFile(this.path, JSON.stringify(products));
            return updatedProduct;
        } catch (error) {
            console.log(error);
        }

    }

    async deleteProduct(id) {
        try {
            const products = await this.getProducts();
            const productIndex = products.findIndex((product) => product.id === id);

            if (productIndex === -1) {
                return `product not found`
            }

            products.splice(productIndex, 1);

            await fs.promises.writeFile(this.path, JSON.stringify(products));
            return `Product deleted`;

        } catch (error) {
            console.log(error);
        }
    }
}

