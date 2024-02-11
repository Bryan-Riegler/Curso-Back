import { connect } from "mongoose";
import config from "../config/config.js";
export const url = config.MONGO_URL;
import { logger } from "../utils/logger.js"

try {
    await connect(url);
    logger.info("Connected to mongo atlas");
} catch (error) {
    logger.error("Error connecting");
}