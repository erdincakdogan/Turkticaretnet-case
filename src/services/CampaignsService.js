const Campaign = require("../models/Campaign")

class CampaignsService {
    
    async campaignActionCheck(discountArray,totalPrice) {
        const campaigns = await Campaign.find({ is_total: true }).where("order_total").lte(totalPrice).exec()
        for (let a = 0; a < campaigns.length; a++) {
            const element = campaigns[a];
            discountArray.push({ campaign_id: element.name, discount: ((totalPrice * element.discount_rate) / 100) })
        }
    }
     checkedDiscount (discountArray, order) {
        if (discountArray.length != 0) {
            var maxDiscount = {discount:0, campaign_id:""}
            for (let u = 0; u < discountArray.length; u++) {
                if (maxDiscount.discount < discountArray[u].discount)
                    maxDiscount = discountArray[u]
                    console.log(discountArray[u])
            }
            order.totalPrice = totalPrice- maxDiscount.discount
            order.discount_list.push({ discount_name: maxDiscount.campaign_id, discount_price: maxDiscount.discount })
            order.discount_totaly= maxDiscount.discount
        } 
     }
      checkedDeliveryCost (order, deliveryCost) {
        if (order.totalPrice >= 150) {
            order.discount_list.push({ discount_name: "Delivery Cost", discount_id: 1, discount_price: deliveryCost })
            order.discount_totaly = order.discount_totaly+deliveryCost
    
        } else {
            order.totalPrice = order.totalPrice + deliveryCost //deliveryCostAction
          
        }
     }
    
    
}
module.exports = new CampaignsService ()

