import { Request, Response } from "express";
import Category from "../models/category-models";
import { ICategory } from "../types";
import { AuthRequest } from "../middleware";

export const getAllCategories = async (
    request: AuthRequest,
    response: Response
) => {
    try {
        const { user } = request;
        console.log(`Fetching categories for user: ${user}`);
        const categories = await Category.find({
            user: user,
        });
        console.log("Fetched categories:", categories);
        return response.send(categories);
    } catch (error) {
        response.send({ error: "Something went wrong" });
        console.log("Error in getAllCategories:", error);
        throw error;
    }
}

export const getCategoryById = async (
    request: AuthRequest,
    response: Response
) => {
    try {
        const { user } = request;
        const { id } = request.params;
        console.log(`Fetching category with id: ${id} for user: ${user}`);
        const category = await Category.findOne({
            _id: id,
        });
        console.log("Fetched category:", category);
        return response.send(category);
    } catch (error) {
        response.send({ error: "Something went wrong" });
        console.log("Error in getCategoryById:", error);
        throw error;
    }
}

export const createCategory = async (
    request: AuthRequest,
    response: Response
) => {
    try {
        const { color, icon, name }: ICategory = request.body;
        const { user } = request;
        console.log(`Creating category for user: ${user} with data:`, { color, icon, name });

        const category = await Category.create({
            color,
            icon,
            name,
            user,
        });
        console.log("Created category:", category);
        response.status(201).send(category);
    } catch (error) {
        console.log("Error in createCategory:", error);
        response.send({ error: "Something went wrong" });
        throw error;
    }
}

export const deleteCategory = async (
    request: AuthRequest,
    response: Response
) => {
    try {
        const { id } = request.params;
        console.log(`Deleting category with id: ${id}`);

        const category = await Category.deleteOne({
            _id: id,
        });
        console.log("Deleted category:", category);
        response.send({ message: "Category deleted successfully" });
    } catch (error) {
        response.send({ error: "Error in deleting the category" });
        console.log("Error in deleteCategory:", error);
        throw error;
    }
}

export const updateCategory = async (
    request: AuthRequest,
    response: Response
) => {
    try {
        const { _id, color, icon, isEditable, name }: ICategory = request.body;
        console.log(`Updating category with id: ${_id} with data:`, { color, icon, isEditable, name });

        await Category.updateOne(
            {
                _id,
            },
            {
                $set: {
                    name,
                    color,
                    icon,
                    isEditable,
                },
            }
        );
        console.log("Updated category with id:", _id);
        response.send({ message: "Category updated successfully" });
    } catch (error) {
        console.log("Error in updateCategory:", error);
        response.send({ error: "Error in updating the category" });
        throw error;
    }
}