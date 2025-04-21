import dotenv from "dotenv";
dotenv.config();
export const PORT = process.env.PORT || 3001;
export const FRONTEND_URL = process.env.FRONTEND_URL;
export const MONGO_URI = `mongodb+srv://khangnguyenminh2k4:${process.env.MONGO_DB}@cluster0.jxrys.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
export const REDIS_URL = process.env.REDIS_URL;
