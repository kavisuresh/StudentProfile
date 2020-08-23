const express = require('express');
const router = express.Router();
const path= require('path');
const { MongoClient } = require('mongodb');

const mongo_port = process.env.MONGO_PORT || 27017;
const mongo_user = process.env.MONGODB_USER;
const mongo_password = process.env.MONGODB_PASSWORD;
const mongo_database = process.env.MONGODB_DATABASE || 'student'
const mongodb_service = process.env.DATABASE_SERVICE_NAME || 'localhost';
let  mongo_url ="";

if ( mongodb_service === 'localhost'){
    mongo_url = `mongodb://${mongodb_service}:${mongo_port}/${mongo_database}`;
}else {
    mongo_url = `mongodb://${mongo_user}:${mongo_password}@${mongodb_service}/${mongo_database}`;
}

router.get('/',(req,res) => {

    MongoClient.connect(mongo_url, {useNewUrlParser: true, useUnifiedTopology: true},(err, database) => {
        if (err){
            console.log("Failed to connect to db;")
        } else {
            console.log("successfully connected to mongo");
    
            const db = database.db('student');
            const student = db.collection('student');
            student.find().toArray((err,result)=>{
                if(err){
                    throw err;
                } else{
                    res.json(result);
                }
            })
        }
    })

});

router.get('/:id',(req,res) => {

    MongoClient.connect(mongo_url, {useNewUrlParser: true, useUnifiedTopology: true}, (err, database) => {
        if (err){
            console.log("Failed to connect to db;")
        } else {
            console.log("successfully connected to mongo");      
            const id = parseInt(req.params.id);
            const db = database.db('student');
            const student = db.collection('student');
            student.findOne({id: id}, (err,result)=>{
                if(err){
                    throw err;
                } else{
                    if ( result !== null ){
                        res.json(result);
                    } else {
                        res.status(400).json({Message : `Student with id ${id} not found`});
                    }
                }
            })
        }
    })

});

router.put('/:id',(req,res) => {

    MongoClient.connect(mongo_url,{useNewUrlParser: true, useUnifiedTopology: true}, (err, database) => {
        if (err){
            console.log("Failed to connect to db;")
        } else {
            console.log("successfully connected to mongo");      
            const id = parseInt(req.params.id);
            const db = database.db('student');
            const student = db.collection('student');
        
            student.findOne({id: id}, (err,result)=>{
                if(err){
                    throw err;
                } else{
                    if ( result !== null ){
                    student.updateOne({id : id} ,{$set: req.body }, {w : 1}, (err,data) => {
                        if (err){
                            throw err;
                        }else
                        {
                            res.status(200).json({ Success : `Student with id ${id} updated successfully`});
                        }
                    });
                    } else {
                        res.status(400).json({ Message : `Student with id ${id} not found`});
                    }
                }
            })
        }
    })

});

router.post('/',(req,res) => {

    MongoClient.connect(mongo_url, {useNewUrlParser: true, useUnifiedTopology: true}, (err, database) => {
        if (err){
            console.log("Failed to connect to db;")
        } else {
            console.log("successfully connected to mongo");      
            const id = parseInt(req.body.id);
            const age = parseInt(req.body.age);
            const db = database.db('student');
            const student = db.collection('student');
            if ( !req.body.id || !req.body.name || !req.body.age || !req.body.stream ){
                res.status(400).json({Error: 'Please provide all required parameters'});
            }else { 
                student.findOne({id: id}, (err,result)=>{
                    if(err){
                        throw err;
                    } else{
                    if ( result !== null ){   
                        res.status(509).json({Error: 'Please provide unique student id'});
                    } else{
                        body = { "id" : id ,
                                "name" : req.body.name,
                                "age" : age,
                                "stream" : req.body.stream
                            }             
                        student.insertOne(body, (err,result)=>{
                        if(err){
                            throw err;
                        } else{
                            res.status(200).json({Message:'Student record inserted successfully'});
                        }
                    });
                }
            }
        });
            }
        }
    })
});            

router.delete('/:id',(req,res) => {

    MongoClient.connect(mongo_url,{useNewUrlParser: true, useUnifiedTopology: true}, (err, database) => {
        if (err){
            console.log("Failed to connect to db;")
        } else {
            console.log("successfully connected to mongo");      
            const id = parseInt(req.params.id);
            const db = database.db('student');
            const student = db.collection('student');
        
            student.findOne({id: id}, (err,result)=>{
                if(err){
                    throw err;
                } else{
                    if ( result !== null ){
                    student.remove({id : id} , (err,data) => {
                        if (err){
                            throw err;
                        }else
                        {
                            res.status(200).json({ Success : `Student with id ${id} deleted successfully`});
                        }
                    });
                    } else {
                        res.status(400).json({Message : `Student with id ${id} not found`});
                    }
                }
            })
        }
    })

});


module.exports = router;