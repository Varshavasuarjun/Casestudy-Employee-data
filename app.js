// Task1: initiate app and run server at 3000
const express=require('express');
const app= new express;
const morgan=require('morgan');
app.use(morgan('dev'));
require('dotenv').config();
const PORT=process.env.PORT;
app.listen(PORT,()=>{
    console.log(`Server is running in the port ${PORT}`);
})
const path=require('path');
app.use(express.static(path.join(__dirname+'/dist/FrontEnd')));

// Task2: create mongoDB connection 

const mongoose=require('mongoose');
const url=process.env.url;
mongoose.connect(url)
.then(()=>{
    console.log('Connected to Atlas db');
})
.catch(()=>{
    console.log('error in connecting Atles');
})

//Task 2 : write api with error handling and appropriate api mentioned in the TODO below

 app.use(express.json());
 app.use(express.urlencoded({extended:true}))
const employeeSchema=mongoose.Schema({
    name:String,
    location:String,
    position:String,
    salary:Number

 });
const employeedata=mongoose.model('Employee',employeeSchema);

//TODO: get data from db  using api '/api/employeelist'

app.get('/api/employeelist',async (req,res)=>{
    try {
        const data= await employeedata.find();
        res.status(200).json(data);
    
    } catch (error) {
        res.status(400).json('cannot get');
    }
  
})

//TODO: get single data from db  using api '/api/employeelist/:id'

app.get('/api/employeelist/:id',async (req,res)=>{
    try {
        const id=req.params.id;
        const data= await employeedata.findById(id);
        res.status(200).json(data);
        console.log(data)
    } catch (error) {
        res.send('cannot get');
        console.log('error in get');
    }
})


//TODO: send data from db using api '/api/employeelist'
//Request body format:{name:'',location:'',position:'',salary:''}

app.post( '/api/employeelist',async (req,res)=>{
    try {
        const item=req.body;
        const newData= await employeedata(item);
        newData.save();
        console.log(newData);
        res.status(200).json('success');
    } 
    catch (error) {
         console.log("failes to post");
        res.status(400).json('failed');
    }
})

//TODO: delete a employee data from db by using api '/api/employeelist/:id'
app.delete('/api/employeelist/:id', async (req,res)=>{
    try {
        const id= req.params.id;
        console.log(id);
        const newdata= await employeedata.findByIdAndDelete(id);
        console.log('deteled succesfully');
        res.status(200).json('success');
        
    } catch (error) {
        console.log("error in deleting");
        
        res.status(400).json('failed');
    }
})


//TODO: Update  a employee data from db by using api '/api/employeelist'
//Request body format:{name:'',location:'',position:'',salary:''}
app.put('/api/employeelist', async (req,res)=>{
    try {
        const id=  req.body._id;
        console.log(id);
        const data= await employeedata.
        findOneAndUpdate({"_id":id},{$set:{"name":req.body.name,"location":req.body.location,"position":req.body.position,"salary":req.body.salary}});
        res.status(200).json('success');
        console.log(data);
        // const updtdata=employeedata.save();
        
        console.log("heloo");
    } catch (error) {
       console.log("error in updating") ;
    }
    
})

//! dont delete this code. it connects the front end file.
app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname + '/dist/Frontend/index.html'));
});