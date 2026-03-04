require("dns").setDefaultResultOrder("ipv4first");
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
app.use(cors());
app.use(express.json());

// ROUTES (declare but don't use until DB connects)
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/events", require("./routes/eventRoutes"));
app.use("/api/departments", require("./routes/departmentRoutes"));
app.use("/api/faculty", require("./routes/facultyRoutes"));
app.use("/api/facilities", require("./routes/facilityRoutes"));
app.use("/api/notices", require("./routes/noticeRoutes"));
app.use("/api/chat", require("./routes/chatRoutes"));

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 30000
    });

    console.log("✅ MongoDB Connected");

    app.listen(5000, () => {
      console.log("🚀 Server Running on port 5000");
    });

  } catch (err) {
    console.error("❌ DB Connection Failed:", err.message);
  }
};

startServer();