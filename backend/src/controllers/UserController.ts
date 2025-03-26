import { Request, Response } from "express";
import {refreshTokenJWTService} from "../services/JwtService";
const UserService = require('../services/UserService');
const User = require('../models/UserModel');
const jwt = require('jsonwebtoken');
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
        console.log(authHeader);
        if (!authHeader || typeof authHeader !== 'string') {
            return res.status(401).json({ message: 'No refresh token provided' });
        }
        const refresh_token = authHeader.split(' ')[1];
        console.log('this is refresh token',refresh_token);
        const response = await refreshTokenJWTService(refresh_token)
        return res.status(200).json(response);
    }
    catch (error: any) {
        return res.status(404).json({ message: error.message });
    }
}
const getUser = async (req: Request, res: Response) => {
    try{
        const user = await UserService.getUser(req.user);
        return res.status(200).json({
            status: 'success',
            userName: user.data.username,
            id: user.data.id
        });
    }
    catch (error: any) {
        return res.status(404).json({ message: error.message });
    }
}
const getAdaFruitInfoController = async (req: Request, res: Response) =>
{
    try{
        const result = await UserService.getAdaFruitInfo(req.user)
        return res.status(200).json(result);
    }
    catch (error: any) {
        return res.status(404).json({ message: error.message });
    }
}
const updateAdaFruitInfoController = async (req: Request, res: Response) =>
{
    try{
        const result = await UserService.updateAdaFruitInfo(req.user,req.body)
        return res.status(200).json(result);
    }
    catch (error: any) {
        return res.status(404).json({ message: error.message });
    }
}

module.exports = { 
    createUser,
    loginUser,
    refresh_token,
    getAdaFruitInfoController,
    updateAdaFruitInfoController, 
    getUser 
};