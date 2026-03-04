const express = require("express");
const Event = require("../models/Event");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();
// UPDATE department
router.put("/:id", protect, adminOnly, async (req,res)=>{
 const updated = await Event.findByIdAndUpdate(
  req.params.id,
  req.body,
  { new:true }
 );
 res.json(updated);
});
// GET all departments
router.get("/", async (req, res) => {
  const data = await Event.find();
  res.json(data);
});

// ADD department
router.post("/", protect, adminOnly, async (req,res)=>{
 try{
  console.log("BODY RECEIVED:", req.body); // debug

  const event = await Event.create({
   title: req.body.title,
   venue: req.body.venue,
   eventDate: req.body.eventDate
  });

  res.json(event);

 }catch(err){
  console.error("EVENT CREATE ERROR:", err.message);
  res.status(500).json({message:"Failed to add event"});
 }
});

// DELETE department
router.delete("/:id", protect, adminOnly, async (req, res) => {
  await Event.findByIdAndDelete(req.params.id);
  res.send("Deleted");
});

module.exports = router;