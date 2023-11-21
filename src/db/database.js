import { connect } from "mongoose";

const url = "mongodb+srv://admin:9zPmib85qRT09Fwh@cluster0.awh1e7y.mongodb.net/CursoCoder?retryWrites=true&w=majority"

try {
    await connect(url);
    console.log("Connected to mongo atlas");
} catch (error) {
    console.log("Error connecting");
}