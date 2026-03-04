const express = require("express");
const axios = require("axios");

const Event = require("../models/Event");
const Department = require("../models/Department");
const Faculty = require("../models/Faculty");
const Facility = require("../models/Facility");
const Notice = require("../models/Notice");
const Cache = require("../models/Cache");
const router = express.Router();

// 🔎 Normalize question for better caching
function normalizeQuestion(q) {
    return q
        .toLowerCase()
        .replace(/[^\w\s]/g, "")   // remove punctuation
        .replace(/\s+/g, " ")      // remove extra spaces
        .trim();
}

// ⏱️ Simple in-memory cooldown (per server)
let lastRequestTime = 0;
const COOLDOWN_MS = 3000; // 2.5 seconds

function buildContext(data) {
    let context = "COLLEGE INFORMATION:\n\n";

    context += "DEPARTMENTS:\n";
    data.departments.forEach(d => {
        context += `• ${d.name} department is located at ${d.location}. HOD: ${d.hod}.\n`;
    });

    context += "\nFACULTY MEMBERS:\n";
    data.faculty.forEach(f => {
        context += `• ${f.name} is ${f.designation} in ${f.department} department.\n`;
    });

    context += "\nEVENTS:\n";
    data.events.forEach(e => {
        context += `• ${e.title} will be held at ${e.venue} on ${e.eventDate}.\n`;
    });

    context += "\nFACILITIES:\n";
    data.facilities.forEach(f => {
        context += `• ${f.name} located at ${f.location}, available during ${f.timings}.\n`;
    });

    context += "\nNOTICES:\n";
    data.notices.forEach(n => {
        context += `• ${n.title}: ${n.details}\n`;
    });

    return context;
}
router.post("/", async (req, res) => {
    let userQuestion = normalizeQuestion(req.body.message);

// synonym handling
userQuestion = userQuestion
    .replace(/\bcs\b/g, "computer engineering")
    .replace(/\bcomp\b/g, "computer engineering")
    .replace(/\bit\b/g, "information technology");

    // 🔍 Check if answer already cached
    const cached = await Cache.findOne({ question: userQuestion });

    if (cached) {
        console.log("✅ Returning cached answer");
        return res.json({ reply: cached.answer });
    }
    const now = Date.now();
    // 🚫 Prevent spamming Gemini
    if (now - lastRequestTime < COOLDOWN_MS) {
        return res.json({
            reply: "⏳ Please wait a moment before asking another question."
        });
    }

    lastRequestTime = now;
    try {
        const data = {
            events: await Event.find().select("title venue eventDate -_id"),
            departments: await Department.find().select("name hod location -_id"),
            faculty: await Faculty.find().select("name department designation -_id"),
            facilities: await Facility.find().select("name location timings -_id"),
            notices: await Notice.find().select("title details -_id")
        };
const context = buildContext(data);
const prompt = `
You are an official AI assistant for a college campus.

Use ONLY the information below to answer.
Understand department synonyms like:
- CS = Computer Engineering
- Comp = Computer Engineering
- IT = Information Technology

If answer is not found, say:
"I don’t have that information in the college database."

Keep answers short and factual.

${context}

QUESTION:
${userQuestion}
`;


        const response = await axios({
            method: "POST",
            url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
            params: { key: process.env.GEMINI_KEY },
            headers: { "Content-Type": "application/json" },
            data: {
                contents: [
                    {
                        parts: [{ text: prompt }]
                    }
                ]
            }
        });

        const reply =
            response.data.candidates?.[0]?.content?.parts?.[0]?.text ||
            "No AI response";

        // 💾 Save to cache
        await Cache.create({
            question: userQuestion,
            answer: reply
        });

        res.json({ reply });

    } catch (error) {
        console.error("Gemini Error:", error.response?.data || error.message);
        res.status(500).json({ reply: "Error talking to AI" });
    }
});

module.exports = router;