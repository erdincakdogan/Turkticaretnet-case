const express = require("express")
const loaders = require("./loaders")
const config = require("./config")
const Product = require("./models/Product")
const Order = require("./models/Order")
const Campaign = require("./models/Campaign")
const { response } = require("express")

config()
loaders.connectDB()

const app = express()
const PORT = 4040
app.use(express.json())

const deliveryCost = 35

app.listen(PORT, () => {
    console.log(`Server ${PORT}'dan ayağa kalktı`)

})
app.get("/", (req, res) => {
    res.json({
        message: "Welcome"
    })

})

app.post("/orders", async function (req, res) { //Controller Katmanı
    const itemlist = req.body
    var totalPrice = 0
    var order = {}
    var campaign = {}
    order.discount_list = []
    order.cart = []
    var discountArray = []

    for (let i = 0; i < itemlist.length; i++) {
        const result = await Product.findOne({ product_id: itemlist[i].product_id }).exec()
        if (result.stock_quantity >= itemlist[i].quantity) {
            totalPrice += (result.list_price * itemlist[i].quantity)
            order.cart.push({ quantity: itemlist[i].quantity, product_id: result.product_id })
                Product.updateOne(
                { _id: result._id },  // <-- find stage
                { $set: {                // <-- set stage
                   stock_quantity: result.stock_quantity-itemlist[i].quantity
                  } 
                }   
              )
              .then(reponse => {
                console.log(reponse)
              })
            const campaign = await Campaign.findOne({ author: result.author, is_total: false }).exec()
            if (campaign) {

                discountArray.push({ campaign_id: campaign._id, discount: campaign.discount_count * (result.list_price) })
            }
        } else {
            console.log("Quantity is not enough")
        }


    }
    if(totalPrice == 0) {
        res.status(500).send("All quantities are not enough in order list")
    }
    const campaigns = await Campaign.find({ is_total: true }).where("order_total").lte(totalPrice).exec()
    for (let a = 0; a < campaigns.length; a++) {
        const element = campaigns[a];
        discountArray.push({ campaign_id: element.name, discount: ((totalPrice * element.discount_rate) / 100) })
    }
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
    if (order.totalPrice >= 150) {
        order.discount_list.push({ discount_name: "Delivery Cost", discount_id: 1, discount_price: deliveryCost })
        order.discount_totaly = order.discount_totaly+deliveryCost

    } else {
        order.totalPrice = order.totalPrice + deliveryCost
      
    }
    const orderResult = await Order.create(order)
    res.send(orderResult)

});

app.post("/offers", function (req, res) {

    res.send("Offer Page")
})
app.post("/campaigns", async function (req, res) {
    const campaigns = await Campaign.create(req.body)
    res.send(campaigns)
})

app.get("/orders/:id", async function (req, res) {
    const orderResult = await Order.findOne({ _id: req.params.id }).exec()
    res.send(orderResult)
});

app.post("/products", async function (req, res) {

    const product = await Product.create(req.body)
    res.send(product)
})


