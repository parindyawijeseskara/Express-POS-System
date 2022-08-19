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
        var customerTableQuery = "create table if not exists customer(id varchar(255) primary key,name varchar(255),address varchar(255), salary double)"
        connection.query(customerTableQuery,function(err,result){
            if(err)throw err;
            if(result.warningCount === 0){
                console.log("Customer table created"); 
            }
        })
    }
})

//get all customers
router.get('/',(req,res)=>{
    var query = "select * from customer";
    connection.query(query,(err,rows) =>{
        if(err) throw err
        res.send(rows)
    })
})

//save customer
router.post('/',(req,res)=>{
    //console.log(req.body);
    const id = req.body.id
    const name = req.body.name
    const address = req.body.address
    const salary = req.body.salary

    var query = "insert into customer(id,name,address,salary) values(?,?,?,?)"

    connection.query(query,[id,name,address,salary],(err) =>{
        if(err){
            res.send({'message':'duplicate entrty'})
        }else{
            res.send({'message':'created customer'})
        }
    })
})

//update customer
router.put('/',(req,res)=>{
    const id = req.body.id
    const name = req.body.name
    const address = req.body.address
    const salary = req.body.salary

    var query = "update customer set name=?, address=?, salary=? where id=?";

    connection.query(query,[name,address,salary,id],(err,rows)=>{
        if(err) console.log(err);

        if(rows.affectedRows > 0){
            res.send({'message':'updated customer!'})
        }else{
            res.send({'message':'customer not found'})
        }
    }) 
})

//delete customer by id
router.delete('/:id',(req,res)=>{
    const id = req.params.id

    var query = "delete from customer where id=?";

    connection.query(query,[id],(err,rows)=>{
        if(err) console.log(err);

        if(rows.affectedRows > 0){
            res.send({'message':'deleted customer'})
        }else{
            res.send({'message':'customer not found'})
        }
    })
})

//get customer by id
router.get('/:id',(req,res)=>{
    const id = req.params.id

    var query = "select * from customer where id=?";

    connection.query(query,[id],(err,rows)=>{
        if(err) console.log(err);
        res.send(rows)
    })
})

module.exports = router