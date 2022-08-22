const express = require('express')
const router = express.Router();
const mysql = require('mysql')
const db = require('../configs/db.configs')


const connection = mysql.createConnection(db.database)
connection.connect(function(err){
    if(err){
        console.log(err);
    }else{
        console.log("Connected to the mysql server!");
        var orderTableQuery = "create table if not exists orders(orderId varchar(255) primary key, customerId varchar(255),orderDate Date)"
       
        connection.query(orderTableQuery,function(err,result){
            if(err) throw err;
            if(result.warningCount === 0){
                console.log("Order table created");
            }
        })
    }
})

//get all orders
router.get('/',(req,res)=>{
    var query = "select * from orders";
    connection.query(query,function(err,rows){
        if(err) throw err;
        res.send(rows)
    })
})

//save order
router.post('/',(req,res)=>{
    const orderId = req.body.orderId
    const customerId = req.body.customerId
    const orderDate = req.body.orderDate

    var query = "insert into orders(orderId,customerId,orderDate) values(?,?,?)"
    connection.query(query,[orderId,customerId,orderDate],(err)=>{
        if(err){
            res.send({'message':'duplicate entry'})
        }else{
            res.send({'message':'saved order'})
        }
    })
})

//update order
router.put('/',(req,res)=>{
    const orderId = req.body.orderId
    const customerId = req.body.customerId
    const orderDate = req.body.orderDate

    var query = "update orders set customerId=?, orderDate=? where orderId=?";
    connection.query(query,[customerId,orderDate,orderId],(err,rows)=>{
        if(err) console.log(err);
        if(rows.affectedRows>0){
            res.send({'message':'updated items!'})
        }else{
            res.send({'message':'item not found'})
        }
    })
})


//delete order by id
router.delete('/:id',(req,res)=>{
    const id = req.params.id

    var query = "delete from orders where orderId=?";
    connection.query(query,[id],(err,rows)=>{
        if(err) console.log(err);

        if(rows.affectedRows> 0){
            res.send({'message':'deleted order!'})
        }else{
            res.send({'message':'order not found'})
        }
    })
})

//get order by id
router.get('/:id',(req,res)=>{
    const id = req.params.id

    var query = "select * from orders where orderId=?";
    connection.query(query,[id],(err,rows)=>{
        if(err) console.log(err);
        res.send(rows)
    })

})


module.exports = router