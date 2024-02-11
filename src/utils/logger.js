import config from "../config/config.js";
import { createLogger, format, transports } from "winston";

const { combine, printf, timestamp, colorize } = format;

const customLevels = {
    levels: {
        fatal: 0,
        error: 1,
        warn: 2,
        info: 3,
        http: 4,
        debug: 5,
    },
    colors: {
        fatal: "magenta",
        error: "red",
        warn: "yellow",
        info: "green",
        http: "blue",
        debug: "cyan",
    }
}

const transportType = config.TRANSPORT_TYPE;

let selectedTransport;

switch (transportType) {
    case "dev":
        selectedTransport = new transports.Console({ level: "debug" });
        break;
    case "prod":
        selectedTransport = new transports.File({ filename: "./src/logs/prodLogs.log", level: "info" });
        break;
}

const logConfig = {
    levels: customLevels.levels,
    format: combine(
        timestamp({
            format: "MM-DD-YYYY HH:mm:ss",
        }),
        colorize({ colors: customLevels.colors }),
        printf((info) => `${info.level} - ${[info.timestamp]} - ${info.message}`)
    ),
    transports: [
        selectedTransport,
        new transports.File({ filename: "./src/logs/errors.log", level: "error" })
    ]
}

export const logger = createLogger(logConfig);

export const loggerTest = () => {
    logger.debug("Prueba DEBUG")
    logger.http("Prueba HTTP")
    logger.info("Prueba INFO")
    logger.warn("Prueba WARN")
    logger.error("Prueba ERROR")
    logger.fatal("Prueba FATAL")
}