const { Schema, model, models } = require("mongoose");

const ProductSchema = new Schema({
    title: {type:String, require:true},
    description: String,
    price: {type: Number, require: true}
})

export const Product = models.Product || model('Product', ProductSchema)