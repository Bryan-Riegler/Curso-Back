import { logger } from "../utils/logger.js";
export const errorHandler = (error, req, res, next) => {
    logger.error(`error ${error.message}`);
    const status = error.status || 500;
    res.status(status).send(error.message);
};