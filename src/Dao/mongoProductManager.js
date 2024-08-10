import { productModel } from "../model/product.model.js";

export default class MDBProductManager {


// Funcion para traerme los productos de mongo
getProducts = async ()=>{
    try{
        return await productModel.find().lean();
    } catch(err) {
        return err
    }
};





}