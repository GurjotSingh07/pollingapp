const express=require('express')
const mongoose=require('mongoose')
const CreateModel=require('./Model/Create')
const cors=require("cors")
const app =express();

app.use(express.json());
app.use(cors())

mongoose.connect("mongodb://127.0.0.1:27017/Server")
.then(()=>console.log("coonected to db"))

app.post('/register',(req,res)=>{
    CreateModel.create(req.body)
    .then(Create => res.json(Create))
    .catch(err =>res.json(err))
})
app.get("/getusers",(req,res)=>{
    CreateModel.find({}).sort('-date')
    .then(Create => res.json(Create))
    .catch(err =>res.json(err))
})
app.get("/register",(req, res)=>{
    res.send(`<h1>Working</h1>`);
})
app.listen(3001,()=>{
    console.log("server is running")
})