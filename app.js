const express = require('express')
const customer = require('./routes/customer')
const item = require('./routes/item')
const order = require('./routes/order')
const orderDetails = require('./routes/orderDetails')
const app = express()
const port = 5000

app.use(express.json())
app.use('/customer',customer)
app.use('/item',item)
app.use('/order',order)
app.use('/orderDetails',orderDetails)

app.get('/',(req,res)=>{
    console.log('get request coming!');
    res.send('get req came for / route');
}) 

app.listen(port,()=>{
    console.log(`app listening on port ${port}`);
})