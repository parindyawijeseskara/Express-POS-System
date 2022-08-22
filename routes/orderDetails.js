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

        var orderDetailsQuery = "create table if not exists orderDetails(orderDetailsId varchar(255) primary key, orderId varchar(255),customerId varchar(255),qty varchar(255))"
        connection.query(orderDetailsQuery,function(err,result){
            if(err) throw err;
            if(result.warningCount === 0){
                console.log("OrderDetails table created!");
            }
        })
    }
})

//get all orderDetails
router.get('/',(req,res)=>{
    var query = "select * from orderdetails";

    connection.query(query,function(err,rows){
        if(err) throw err;
        res.send(rows)
    })
})

//save orderDetails
router.post('/',(req,res)=>{
    const orderDetailsId = req.body.orderDetailsId
    const orderId = req.body.orderId
    const customerId = req.body.customerId
    const qty = req.body.qty

    var query = "insert into orderdetails(orderdetailsId,orderId,customerId,qty) values(?,?,?,?)"
    connection.query(query,[orderDetailsId,orderId,customerId,qty],(err)=>{
        if(err){
            res.send({'message':'duplicate entry!'})
        }else{
            res.send({'message':'saved orderDetails!'})
        }
    })
})

//update orderDetails
router.put('/',(req,res)=>{
    const orderDetailsId = req.body.orderDetailsId
    const orderId = req.body.orderId
    const customerId = req.body.customerId
    const qty = req.body.qty

    var query = "update orderdetails set orderId=?,customerId=?,qty=? where orderDetailsId=?";
    connection.query(query,[orderId,customerId,qty,orderDetailsId],(err,rows)=>{
        if(err) throw err;
        if(rows.affectedRows>0){
            res.send({'message':'updated orderDetails!'})
        }else{
            res.send({'message':'orderDetails not found'})
        }
    })
})

//delete orderDetails by id
router.delete('/:id',(req,res)=>{
    const id = req.params.id

    var query = "delete from orderdetails where orderDetailsId=?";
    connection.query(query,[id],(err,rows)=>{
        if(err) throw err
        if(rows.affectedRows>0){
            res.send({'message':'deleted orderDetails!'})
        }else{
            res.send({'message':'orderDetails not found'})
        }
    })
})

//get orderDetails by id
router.get('/:id',(req,res)=>{
    const id = req.params.id

    var query = "select * from orderdetails where orderDetailsId=?";
    connection.query(query,[id],(err,rows)=>{
        if(err) throw err;
        res.send(rows)
    })
})


module.exports = router