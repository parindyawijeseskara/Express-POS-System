const express = require('express')
const router = express.Router()
const mysql = require('mysql')
const db = require('../configs/db.configs')

const connection = mysql.createConnection(db.database)
connection.connect(function(err){
    if(err){
        console.log(err);
    }else{
        console.log("Connected to the mysql server!");
        var itemTableQuery = "create table if not exists item(code varchar(255) primary key,name varchar(255),qty varchar(255), price double)"
        connection.query(itemTableQuery,function(err,result){
            if(err)throw err;
            if(result.warningCount === 0){
                console.log("Item table created"); 
            }
        })
    }
})

//get all items
router.get('/',(req,res)=>{
    var query = "select * from item";
    connection.query(query,(err,rows) =>{
        if(err) throw err
        res.send(rows)
    })
})

//save item
router.post('/',(req,res)=>{
    //console.log(req.body);
    const code = req.body.code
    const name = req.body.name
    const qty = req.body.qty
    const price = req.body.price

    var query = "insert into item(code,name,qty,price) values(?,?,?,?)"

    connection.query(query,[code,name,qty,price],(err) =>{
        if(err){
            res.send({'message':'duplicate entrty'})
        }else{
            res.send({'message':'created item'})
        }
    })
})

//update item
router.put('/',(req,res)=>{
    const code = req.body.code
    const name = req.body.name
    const qty = req.body.qty
    const price = req.body.price

    var query = "update item set name=?, qty=?, price=? where code=?";

    connection.query(query,[name,qty,price,code],(err,rows)=>{
        if(err) console.log(err);

        if(rows.affectedRows > 0){
            res.send({'message':'updated item!'})
        }else{
            res.send({'message':'item not found'})
        }
    }) 
})

//delete item by id
router.delete('/:id',(req,res)=>{
    const id = req.params.id

    var query = "delete from item where code=?";

    connection.query(query,[id],(err,rows)=>{
        if(err) console.log(err);

        if(rows.affectedRows > 0){
            res.send({'message':'deleted item'})
        }else{
            res.send({'message':'item not found'})
        }
    })
})

//get item by id
router.get('/:id',(req,res)=>{
    const id = req.params.id

    var query = "select * from item where code=?";

    connection.query(query,[id],(err,rows)=>{
        if(err) console.log(err);
        res.send(rows)
    })
})

module.exports = router
