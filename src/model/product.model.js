import { Schema, model } from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';

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
});
productSchema.plugin(mongoosePaginate);

export const productModel = model('products', productSchema);
