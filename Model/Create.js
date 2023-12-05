const mongoose=require('mongoose')
const CreateSchema= new mongoose.Schema({
question:String,
point:String,
point2:String,
point3:String,



})
const CreateModel=mongoose.model("Create",CreateSchema)
module.exports=CreateModel