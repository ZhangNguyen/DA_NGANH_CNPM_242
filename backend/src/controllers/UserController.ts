import { Request, Response } from "express";
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
module.exports = { createUser };