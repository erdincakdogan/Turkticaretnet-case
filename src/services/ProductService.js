const Campaign = require("../models/Campaign")
const Product = require("../models/Product")

class ProductService {

    productUpdate(result, i, itemlist) {
        Product.updateOne(
            { _id: result._id },
            {
                $set: {
                    stock_quantity: result.stock_quantity - itemlist[i].quantity
                }
            }
        )
            .then(reponse => {
                console.log(reponse)
            })
    }
    checkedDeliveryCost(order, deliveryCost) {
        if (order.totalPrice >= 150) {
            order.discount_list.push({ discount_name: "Delivery Cost", discount_id: 1, discount_price: deliveryCost })
            order.discount_totaly = order.discount_totaly + deliveryCost

        } else {
            order.totalPrice = order.totalPrice + deliveryCost //deliveryCostAction

        }
    }
    async prepareOrder  (itemlist,order, discountArray) {
        var totalPrice= 0
        for (let i = 0; i < itemlist.length; i++) {
            const result = await Product.findOne({ product_id: itemlist[i].product_id }).exec()
            if (result.stock_quantity >= itemlist[i].quantity) {
                totalPrice += (result.list_price * itemlist[i].quantity)
                order.cart.push({ quantity: itemlist[i].quantity, product_id: result.product_id })
                   
                const campaign = await Campaign.findOne({ author: result.author, is_total: false }).exec()
                if (campaign) {
                    discountArray.push({ campaign_id: campaign._id, discount: campaign.discount_count * (result.list_price) })
                }
            } else {
                console.log(`Quantity is not enough for:${result.title}`)
            }
    
    }
    return totalPrice
    }
     checkedTotalyPriced(totalPrice, res){
        if(totalPrice == 0) {
            throw new Error("All quantities are not enough in order list")
        }
        }
};



module.exports = new ProductService()

