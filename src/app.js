const express = require("express")
const loaders = require("./loaders")
const config = require("./config")
const Product = require("./models/Product")
const Order = require("./models/Order")

config ()
loaders.connectDB()

const app = express()
const PORT = 4040
app.use(express.json())

const deliveryCost = 35

app.listen(PORT, () => {
    console.log(`Server ${PORT}'dan ayağa kalktı`)

})
app.get("/", (req,res) => {
    res.json({
        message: "Welcome"
    })

})

app.post("/orders", async function (req, res) { //Controller Katmanı
    const itemlist = req.body
    var totalPrice = 0   
    var order = {}
    order.discount_list = []
    order.cart = []
    
    for (let i = 0; i < itemlist.length; i++) {
        const result = await Product.findOne({product_id: itemlist[i].product_id}).exec()
        
        if(result.stock_quantity >= itemlist[i].quantity) {
            console.log(`Order: ${result.title} has been completed`)
            totalPrice+= (result.list_price* itemlist[i].quantity)
            order.cart.push({quantity:itemlist[i].quantity  ,product_id:result.product_id})
        }else{
            console.log("Quantity is not enough")
        }
       
    }
    if(totalPrice >= 150) {
        console.log(`Total Price:${totalPrice}`)
        order.totalPrice = totalPrice
        order.discount_list.push({discount_name: "Delivery Cost", discount_id: 1, discount_price: deliveryCost})
        order.discount_totaly = deliveryCost
    }else{
        order.totalPrice = totalPrice+deliveryCost
        console.log(`Total Price: ${totalPrice+ deliveryCost}`)
    }
    console.log(order)
    const orderResult = await Order.create(order)
    res.send(orderResult)

  });

app.post("/offers", function (req,res) {
    res.send("Offer Page")
})
app.get("/orders/:id", async function (req, res) {
    const orderResult = await Order.findOne({_id: req.params.id}).exec()
    res.send(orderResult)
});

app.post("/products", async function(req, res) {
  
    const product = await Product.create(req.body)
    console.log(product)
    res.send(product) 
}) 


