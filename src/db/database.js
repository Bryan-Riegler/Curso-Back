import { connect } from "mongoose";
import "dotenv/config"
export const url = process.env.MONGO_URL
import { logger } from "../utils/logger.js"

try {
    await connect(url);
    logger.info("Connected to mongo atlas");
} catch (error) {
    logger.error("Error connecting");
}