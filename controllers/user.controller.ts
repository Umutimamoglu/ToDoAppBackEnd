import { Request, Response } from "express"
import bcrypt from 'bcrypt'
import User from "../models/user-model"
import { Types } from 'mongoose'
import jwt from 'jsonwebtoken'
import { IUser } from '../types/index'


const getUserToken = (_id: Types.ObjectId) => {
    const authenticatedUserToken = jwt.sign({ _id: _id.toString() }, "express", {
        expiresIn: "7d",
    });
    return authenticatedUserToken;
};

export const createUser = async (request: Request, response: Response) => {
    try {
        const { name, email, password } = request.body;


        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return response.status(409).send("kullanıc zaten mevcutt")
        }
        // Password'u hash'le
        const hashedPassword = await bcrypt.hash(password, 12);

        // Yeni kullanıcı oluştur ve hashedPassword'i kaydet
        const user = await User.create({
            name,
            email,
            password: hashedPassword, // hashedPassword olarak doğru şekilde kaydedildi
        });

        return response.status(201).send({ message: "User created successfully" });
    } catch (error) {
        console.log("Error in createUser", error);
        response.status(500).send({ message: "Server error" });
    }
};
export const loginUser = async (request: Request, response: Response) => {
    try {
        const { email, password }: IUser = request.body;
        console.log("Gelen istek verileri:", request.body); // Gelen verileri kontrol edin
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            console.log("E-posta için kullanıcı bulunamadı:", email);
            return response.status(409).send({ message: "Kullanıcı bulunamadı" });
        }

        const isPasswordIdentical = await bcrypt.compare(password, existingUser.password);
        if (isPasswordIdentical) {
            const token = getUserToken(existingUser._id);
            console.log("Kullanıcı başarıyla kimlik doğruladı:", email);
            return response.send({
                token,
                user: {
                    email: existingUser.email,
                    name: existingUser.name,
                },
            });
        } else {
            console.log("Yanlış şifre için e-posta:", email);
            return response.status(400).send({ message: "Yanlış kimlik bilgileri" });
        }
    } catch (error) {
        console.log('loginUser Hatası:', error);
        response.status(500).send({ message: "Sunucu hatası" });
    }
};