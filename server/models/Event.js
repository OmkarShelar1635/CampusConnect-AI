const mongoose=require("mongoose");

module.exports=mongoose.model("Event",new mongoose.Schema({
 title:String,
 venue:String,
 eventDate:String
}));