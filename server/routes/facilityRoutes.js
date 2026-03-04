const express = require("express");
const Facility = require("../models/Facility");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();
// UPDATE department
router.put("/:id", protect, adminOnly, async (req,res)=>{
 const updated = await Facility.findByIdAndUpdate(
  req.params.id,
  req.body,
  { new:true }
 );
 res.json(updated);
});
// GET all departments
router.get("/", async (req, res) => {
  const data = await Facility.find();
  res.json(data);
});

// ADD department
router.post("/", protect, adminOnly, async (req,res)=>{
 try{
  console.log("BODY RECEIVED:", req.body); // debug

  const facility = await Facility.create({
   name: req.body.name,
   location: req.body.location,
   timings: req.body.timings
  });

  res.json(facility);

 }catch(err){
  console.error("FACILITY CREATE ERROR:", err.message);
  res.status(500).json({message:"Failed to add facility"});
 }
});

// DELETE department
router.delete("/:id", protect, adminOnly, async (req, res) => {
  await Facility.findByIdAndDelete(req.params.id);
  res.send("Deleted");
});

module.exports = router;