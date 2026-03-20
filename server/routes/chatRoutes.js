import express from "express";
import axios from "axios";
import natural from "natural";

import Event from "../models/Event.js";
import Department from "../models/Department.js";
import Faculty from "../models/Faculty.js";
import Facility from "../models/Facility.js";
import Notice from "../models/Notice.js";
import Cache from "../models/Cache.js";

const router = express.Router();


// ---------------- ML CLASSIFIER ----------------
let classifier;

natural.BayesClassifier.load("./ml/model.json", null, (err, cl) => {
 if (err) {
  console.log("ML model load error:", err);
 } else {
  classifier = cl;
  console.log("ML intent classifier loaded");
 }
});


// ---------------- NORMALIZE QUESTION ----------------
function normalizeQuestion(q) {
 return q
  .toLowerCase()
  .replace(/[^\w\s]/g, "")
  .replace(/\s+/g, " ")
  .trim();
}


// ---------------- RATE LIMIT ----------------
let lastRequestTime = 0;
const COOLDOWN_MS = 3000;


// ---------------- CHAT ROUTE ----------------
router.post("/", async (req, res) => {

 let userQuestion = normalizeQuestion(req.body.message);

 // synonym replacement
 userQuestion = userQuestion
  .replace(/\bcs\b/g, "computer engineering")
  .replace(/\bcomp\b/g, "computer engineering")
  .replace(/\bit\b/g, "information technology");


 // -------- CACHE CHECK --------
 const cached = await Cache.findOne({ question: userQuestion });

 if (cached) {
  console.log("Returning cached answer");
  return res.json({ reply: cached.answer });
 }


 // -------- RATE LIMIT --------
 const now = Date.now();

 if (now - lastRequestTime < COOLDOWN_MS) {
  return res.json({
   reply: "Please wait a moment before asking another question."
  });
 }

 lastRequestTime = now;


 try {

  // -------- INTENT DETECTION --------
  let intent = "unknown";

  if (classifier) {
   intent = classifier.classify(userQuestion);
  }
  console.log("User question:", userQuestion);
  console.log("Predicted intent:", intent);


  let responseText = "";


  // -------- DEPARTMENT HOD --------
  if (intent === "department_hod") {

   const dept = await Department.findOne({
    name: /computer/i
   });

   if (dept) {
    responseText =
     `The HOD of ${dept.name} department is ${dept.hod}.`;
   }

  }


  // -------- FACULTY --------
  else if (intent === "faculty_query") {

   const faculty = await Faculty.find();

   responseText = faculty.map(f =>
    `${f.name} (${f.designation}) - ${f.department}`
   ).join("\n");

  }


  // -------- EVENTS --------
  else if (intent === "event_query") {

   const events = await Event.find();

   responseText = events.map(e =>
    `${e.title} on ${e.eventDate} at ${e.venue}`
   ).join("\n");

  }


  // -------- FACILITIES --------
  else if (intent === "facility_query") {

   const facilities = await Facility.find();

   responseText = facilities.map(f =>
    `${f.name} located at ${f.location}`
   ).join("\n");

  }


  // -------- NOTICES --------
  else if (intent === "notice_query") {

   const notices = await Notice
    .find()
    .sort({ date: -1 })
    .limit(3);

   responseText = notices.map(n =>
    `${n.title} - ${n.details}`
   ).join("\n");

  }
  else if (intent === "greeting") {

 responseText =
 "Hello! I am CampusConnect AI. I can help you with information about departments, faculty, events, facilities, and notices.";

}
else if(intent === "unknown"){
 responseText = "Sorry, I didn't understand that. You can ask about departments, faculty, events, facilities, or notices.";
}


  // -------- FALLBACK: GEMINI WITH CONTEXT --------
  if (!responseText) {

   const data = {
    events: await Event.find().select("title venue eventDate -_id"),
    departments: await Department.find().select("name hod location -_id"),
    faculty: await Faculty.find().select("name department designation -_id"),
    facilities: await Facility.find().select("name location timings -_id"),
    notices: await Notice.find().select("title details -_id")
   };

   const prompt = `
You are a smart campus assistant.

Use the following database information to answer.

DATABASE:
${JSON.stringify(data)}

QUESTION:
${userQuestion}
`;

   const response = await axios({
    method: "POST",
    url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
    params: { key: process.env.GEMINI_KEY },
    headers: { "Content-Type": "application/json" },
    data: {
     contents: [{ parts: [{ text: prompt }] }]
    }
   });

   responseText =
    response.data.candidates?.[0]?.content?.parts?.[0]?.text ||
    "No AI response";
  }


  // -------- GEMINI FORMAT RESPONSE --------
  else {

   const prompt = `
You are a smart campus assistant.

Convert this information into a helpful natural response.

DATA:
${responseText}

QUESTION:
${userQuestion}
`;

   const ai = await axios({
    method: "POST",
    url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
    params: { key: process.env.GEMINI_KEY },
    headers: { "Content-Type": "application/json" },
    data: {
     contents: [{ parts: [{ text: prompt }] }]
    }
   });

   responseText =
    ai.data.candidates?.[0]?.content?.parts?.[0]?.text || responseText;
  }


  // -------- SAVE CACHE --------
  await Cache.create({
   question: userQuestion,
   answer: responseText
  });


  res.json({ reply: responseText });


 } catch (error) {

  console.error("Gemini Error:", error.response?.data || error.message);

  res.status(500).json({
   reply: "Error talking to AI"
  });
 }

});

export default router;