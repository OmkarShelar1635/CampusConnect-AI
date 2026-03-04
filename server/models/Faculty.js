const mongoose=require("mongoose");

module.exports=mongoose.model("Faculty",new mongoose.Schema({
 name:String,
 department:String,
 designation:String,
 email:String
}));