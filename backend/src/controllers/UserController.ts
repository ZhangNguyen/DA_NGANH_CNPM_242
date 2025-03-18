import { Request, Response } from "express";
const JwtService = require("../middleware/authMiddleware");
const UserService = require('../services/UserService');
const createUser = async(req: Request, res: Response) => {
    try {
        const {username, email, password,confirmPassword,phone} = req.body;
        const regex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isCheckEmail = regex.test(email);
        if (!username || !email || !password || !confirmPassword || !phone) {
            return res.status(200).json({ 
                status: 'error',
                message: "All fields are required" });
        } else if(!isCheckEmail) {
            return res.status(200).json({
                status: 'error',
                message: "Invalid email format" });
        } else if(password !== confirmPassword) {
            return res.status(200).json({
                status: 'error',
                message: "Password and Confirm Password do not match" });
        } 
        const result = await UserService.createUser(req.body);
        return res.status(200).json(result);
    }catch (error: any) {
        return res.status(404).json({ message: error.message });
    }
}
const loginUser = async (req: Request, res: Response) => {
    try{
        const result = await UserService.loginUser(req.body);
        return res.status(200).json(result);
    }
    catch (error: any) {
        return res.status(404).json({ message: error.message });
    }
}
const refresh_token = async (req: Request, res: Response) => {
    try{
        const authHeader = req.headers.authorization;

        if (!authHeader || typeof authHeader !== 'string') {
            return res.status(401).json({ message: 'No refresh token provided' });
        }
        const refresh_token = authHeader.split(' ')[1];
        const response = await JwtService.refreshTokenJWTService(refresh_token)
        return res.status(200).json(response);
    }
    catch (error: any) {
        return res.status(404).json({ message: error.message });
    }
}
module.exports = { createUser,loginUser,refresh_token };