import { fakerES as faker } from "@faker-js/faker";

export const generateProducts = () => {
    return {
        title: faker.commerce.product(),
        description: faker.commerce.productDescription(),
        price: faker.number.int({ min: 10, max: 10000 }),
        code: faker.string.alphanumeric(5),
        stock: faker.number.int(100),
        category: faker.commerce.department(),
        status: faker.datatype.boolean({ probability: 0.6 })
    }
}