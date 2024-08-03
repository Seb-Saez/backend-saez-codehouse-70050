import { Schema, model } from "mongoose";
import { type } from "os"


const productSchema = new Schema({
    title: String,
    description: String,
    code: {
        type: Number,
        unique: true
    },
    price: Number,
    status: Boolean,
    stock: Number,
    category: {
        type: String,
        enum: ["Perifericos", "Monitores", "Notebooks", "GPU", "Gabinetes"]
    },
    thumbnails: [String]     // Agregar el array de imagenes, ni idea como se hace
})

export const productModel = model('products', productSchema);
