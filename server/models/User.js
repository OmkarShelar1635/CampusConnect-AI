import mongoose from "mongoose";

export default mongoose.model("User",new mongoose.Schema({
 name: {
    type: String,
    required: true
  },
 email: {
    type: String,
    required: true,
    unique: true
  },
 password: {
    type: String,
    required: true
  },
 role:{type:String,default:"user"}
}));