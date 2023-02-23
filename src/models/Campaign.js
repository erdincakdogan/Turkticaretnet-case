const mongoose = require("mongoose")

const CampaignSchema = new mongoose.Schema({
    discount_rate: Number,
    discount_count: Number,
    is_total: Boolean,
    order_total: Number,
    author: String,
    name: String

},
    {
        timestamps: true,
        versionKey: false
    }
)

module.exports = mongoose.model("Campaign", CampaignSchema)

