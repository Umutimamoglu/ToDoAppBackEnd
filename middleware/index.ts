import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import User from "../models/user-model";

export interface AuthRequest extends Request {
    user: string;
}

export const authenticationMiddleware = async (request: AuthRequest, response: Response, next: NextFunction) => {
    try {
        const { authorization } = request.headers;
        if (!authorization) {
            console.log("Authorization header missing");
            return response.status(401).json({
                error: "Authorization required"
            });
        }

        const token = authorization;
        const { _id } = jwt.verify(token, "express") as any;
        const existingUser = await User.findOne({ _id });

        if (existingUser) {
            console.log(`Authenticated user: ${existingUser.id}`);
            request.user = existingUser.id;
            next();
        } else {
            console.log("User not found");
            response.status(401).json({ error: "Invalid token" });
        }
    } catch (error) {
        console.log("Error in authenticationMiddleware:", error);
        response.status(500).json({ error: "Authentication error" });
    }
};