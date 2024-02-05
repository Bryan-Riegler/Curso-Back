import { Router } from "express";
const router = new Router();
import { loggerTest } from "../utils/logger.js";

router.get("/loggerTest", (res) => {
    loggerTest()

})

export default router;