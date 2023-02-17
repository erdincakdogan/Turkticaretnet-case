const express = require("express")
const loaders = require("./loaders")
const config = require("./config")
const Product = require("./models/Product")

config ()
loaders.connectDB()

const app = express()
const PORT = 4040
app.use(express.json())

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
       
    for (let i = 0; i < itemlist.length; i++) {
        const result = await Product.findOne({product_id: itemlist[i].product_id}).exec() 
        console.log(result.quantity)
       
    }
 
    res.send("result")

  });

app.post("/offers", function (req,res) {
    res.send("Offer Page")
})
app.get("/orders/:id", function (req, res) {
    res.send(`${req.params.id} has been showed`)
});

app.post("/products", async function(req, res) {
  
    const product = await Product.create(req.body)
    console.log(product)
    res.send(product) 
}) 


