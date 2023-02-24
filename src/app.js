const express = require("express")
const loaders = require("./loaders")
const config = require("./config")
const Product = require("./models/Product")
const Order = require("./models/Order")
const Campaign = require("./models/Campaign")
const { response } = require("express")
const ProductService = require("./services/ProductService")
const CampaignsService = require("./services/CampaignsService")

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
    var order = {}
    var campaign = {}
    order.discount_list = []
    order.cart = []
    var discountArray = []
    try {
        let totalPrice= await ProductService.prepareOrder(itemlist,order, discountArray)
        ProductService.checkedTotalyPriced(totalPrice,res)
        CampaignsService.campaignActionCheck(discountArray,totalPrice)
        CampaignsService.checkedDiscount(discountArray, order)
        CampaignsService.checkedDeliveryCost (order, deliveryCost)
         
        const orderResult = await Order.create(order)
        res.send(orderResult)
    } catch (error) {
       res.status(500).send(`order problem occured: ${error}`)
    }  
});

app.post("/offers", function (req, res) {

    res.send("Offer Page")
})
app.post("/definecampaigns", async function (req, res) {
    const defineCampaigns = await Campaign.create(req.body)
    res.send(defineCampaigns)
})

app.get("/orders/:id", async function (req, res) {
    const orderResult = await Order.findOne({ _id: req.params.id }).exec()
    res.send(orderResult)
});

app.post("/products", async function (req, res) {

    const product = await Product.create(req.body)
    res.send(product)
})
