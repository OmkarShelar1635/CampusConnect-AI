import express from "express";
import Department from "../models/Department.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
const router = express.Router();

// GET all departments
// UPDATE department
router.put("/:id", protect, adminOnly, async (req,res)=>{
 try{
  const updated = await Department.findByIdAndUpdate(
   req.params.id,
   req.body,
   { new:true, runValidators:true }
  );

  if(!updated){
   return res.status(404).json({message:"Department not found"});
  }

  res.json(updated);

 }catch(err){
  console.error("UPDATE ERROR:", err.message);
  res.status(500).json({message:"Update failed"});
 }
});

router.get("/", async (req, res) => {
  const data = await Department.find();
  res.json(data);
});

// ADD department
router.post("/", protect, adminOnly, async (req, res) => {
  const dept = await Department.create(req.body);
  res.json(dept);
});

// DELETE department
router.delete("/:id", protect, adminOnly, async (req, res) => {
  await Department.findByIdAndDelete(req.params.id);
  res.send("Deleted");
});

export default router;