import mongoose from "mongoose";

export default mongoose.model("Notice",new mongoose.Schema({
 title:String,
 details:String,
 issuedBy:String,
 date:{type:Date,default:Date.now}
}));