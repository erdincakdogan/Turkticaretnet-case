const mongoose = require("mongoose")

const ProductSchema = new mongoose.Schema({

    product_id: Number,
    title: String,
    category_id: Number,
    category_title: String,
    author: String,
    list_price: Number,
    stock_quantity: Number
},
    {
        timestamps: true,
        versionKey: false
    }
)

module.exports = mongoose.model("Product", ProductSchema)