import "dotenv/config";

export default {
    MONGO_URL: process.env.MONGO_URL,
    PORT: process.env.PORT,
    PRIVATE_KEY: process.env.PRIVATE_KEY,
    TRANSPORT_TYPE: process.env.TRANSPORT_TYPE,
    EMAIL: process.env.EMAIL,
    PASSWORD: process.env.PASSWORD,
}
