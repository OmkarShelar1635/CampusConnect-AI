import mongoose from "mongoose";

export default mongoose.model("Department",new mongoose.Schema({
 name:String,
 hod:String,
 location:String,
 contact:String
}));