import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
    products: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'products',
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                min: 1
            }
        }
    ]
});

const cartModel = mongoose.model('carts', cartSchema);
export default cartModel;
