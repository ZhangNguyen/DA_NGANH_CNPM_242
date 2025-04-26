import { Request, Response, NextFunction } from 'express';

const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config()
const authMiddlewareClient = (req: Request, res: Response, next: NextFunction) => {
    try {
        const tokenHeader = req.headers.authorization;

        // Kiểm tra token có tồn tại không
        if (!tokenHeader || typeof tokenHeader !== 'string') {
            return res.status(401).json({ message: 'No token provided' });
        }

        // Lấy token từ header
        const token = tokenHeader.split(' ')[1];

        // Verify token
        jwt.verify(token, process.env.ACCESS_TOKEN as string, (err: any, decoded: any) => {
            try {
                if (err) {
                    // Xử lý các lỗi khác nhau
                    if (err.name === 'TokenExpiredError') {
                        return res.status(401).json({ message: 'Token is expired' });
                    } else if (err.name === 'JsonWebTokenError') {
                        return res.status(403).json({ message: 'Token is invalid' });
                    } else {
                        return res.status(403).json({ message: 'Token verification failed' });
                    }
                }
                req.user = decoded;
                next();
            } catch (error) {
                return res.status(500).json({ message: 'Internal server error' });
            }
        });

    } catch (err) {
        return res.status(500).json({ message: 'Something went wrong in middleware' });
    }
};

module.exports = {authMiddlewareClient};