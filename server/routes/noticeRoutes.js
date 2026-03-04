const express = require("express");
const Notice = require("../models/Notice");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();
// UPDATE department
router.put("/:id", protect, adminOnly, async (req,res)=>{
 const updated = await Notice.findByIdAndUpdate(
  req.params.id,
  req.body,
  { new:true }
 );
 res.json(updated);
});
// GET all departments
router.get("/", async (req, res) => {
  const data = await Notice.find();
  res.json(data);
});

// ADD department
router.post("/", protect, adminOnly, async (req,res)=>{
 try{
  console.log("BODY RECEIVED:", req.body); // debug

  const notice = await Notice.create({
   title: req.body.title,
   details: req.body.details,
   issuedBy: req.body.issuedBy,
   date: req.body.date
  });

  res.json(notice);

 }catch(err){
  console.error("NOTICE CREATE ERROR:", err.message);
  res.status(500).json({message:"Failed to add notice"});
 }
});

// DELETE department
router.delete("/:id", protect, adminOnly, async (req, res) => {
  await Notice.findByIdAndDelete(req.params.id);
  res.send("Deleted");
});

module.exports = router;