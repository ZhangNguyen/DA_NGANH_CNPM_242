import express, { Request, Response } from "express";
import './types/index';
import dotenv from "dotenv";
import mongoose from "mongoose";
import routes from "./routes/index";

let cors = require('cors');

const bodyParser = require("body-parser");
dotenv.config();
const app = express();
const port = process.env.PORT || 3001;

app.use(bodyParser.json());

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}));

mongoose.connect(`mongodb+srv://khangnguyenminh2k4:${process.env.MONGO_DB}@cluster0.jxrys.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`)
.then(() => {
  console.log("Connected to MongoDB");
})
.catch((err) => {
  console.log(err);
});
routes(app);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
