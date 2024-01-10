import { connect } from "mongoose";
import "dotenv/config"
export const url = process.env.MONGO_URL

try {
    await connect(url);
    console.log("Connected to mongo atlas");
} catch (error) {
    console.log("Error connecting");
}