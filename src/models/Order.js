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

/*const schema = new Schema({
    email: { type: String, unique: true, required: true },
    hash: { type: String, required: true },
    createdDate: { type: Date, default: Date.now },
    settings: {
      favorites: [String],
      cart: [
        {
          quantity: Number,
          marketId: String
        }
      ],
      states: {
        favorites: { type: Boolean, default: true },
        search: { type: Boolean, default: false },
        category: { type: Schema.Types.Mixed, default: false }
      }
    }
  }) */