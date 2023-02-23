const mongoose = require("mongoose")

const OrderSchema = new mongoose.Schema({
    order_id: Number,
    discount_total: Number,
    total_price: Number,
    cart: [
        {
          quantity: Number,
          product_id: Number
        }
      ],
      discount_list: [
        {
          discount_name: String,
          discount_id: Number,
          discount_price: Number
        }
      ],
},
    {
        timestamps: true,
        versionKey: false
    }
)

module.exports = mongoose.model("Order", OrderSchema)

