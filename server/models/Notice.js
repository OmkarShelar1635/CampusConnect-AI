const mongoose=require("mongoose");

module.exports=mongoose.model("Notice",new mongoose.Schema({
 title:String,
 details:String,
 issuedBy:String,
 date:{type:Date,default:Date.now}
}));