import mongoose, { Schema } from "mongoose";

// Schema for Category
const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    isEditable: {
        type: Boolean,
        required: false,
        default: true,
    },
    color: {
        id: { type: String },
        name: { type: String },
        code: { type: String },
    },
    icon: {
        id: { type: String },
        name: { type: String },
        symbol: { type: String },
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
});

// Creating the model from the schema
const Category = mongoose.model("Category", categorySchema);

export default Category;