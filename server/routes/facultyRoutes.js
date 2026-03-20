
import express from "express";
import Faculty from "../models/Faculty.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
const router = express.Router();
// UPDATE department
router.put("/:id", protect, adminOnly, async (req,res)=>{
 const updated = await Faculty.findByIdAndUpdate(
  req.params.id,
  req.body,
  { new:true }
 );
 res.json(updated);
});
// GET all departments
router.get("/", async (req, res) => {
  const data = await Faculty.find();
  res.json(data);
});

// ADD department
router.post("/", protect, adminOnly, async (req,res)=>{
 try{
  console.log("BODY RECEIVED:", req.body); // debug

  const faculty = await Faculty.create({
   name: req.body.name,
   department: req.body.department,
   designation: req.body.designation,
   email: req.body.email
  });

  res.json(faculty);

 }catch(err){
  console.error("FACULTY CREATE ERROR:", err.message);
  res.status(500).json({message:"Failed to add faculty"});
 }
});

// DELETE department
router.delete("/:id", protect, adminOnly, async (req, res) => {
  await Faculty.findByIdAndDelete(req.params.id);
  res.send("Deleted");
});

export default router;