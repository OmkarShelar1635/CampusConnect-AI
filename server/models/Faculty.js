import mongoose from "mongoose";

export default mongoose.model("Faculty",new mongoose.Schema({
 name:String,
 department:String,
 designation:String,
 email:String
}));