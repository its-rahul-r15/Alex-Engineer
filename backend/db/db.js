import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";


function connectDB() {
    mongoose.connect(process.env.MONGO_URI).then(() => {
        console.log("Connected to MongoDB");
    }).catch((err) => { 
        console.error("Error connecting to MongoDB", err);
    });
}

export default connectDB;