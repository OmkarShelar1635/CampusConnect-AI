import mongoose from "mongoose";

export default mongoose.model("Facility",new mongoose.Schema({
 name:String,
 location:String,
 timings:String
}));