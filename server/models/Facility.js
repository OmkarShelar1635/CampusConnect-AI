const mongoose=require("mongoose");

module.exports=mongoose.model("Facility",new mongoose.Schema({
 name:String,
 location:String,
 timings:String
}));