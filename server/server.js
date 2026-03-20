import dns from "dns"
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
dns.setDefaultResultOrder("ipv4first");
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

import authRoutes from "./routes/authRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import departmentRoutes from "./routes/departmentRoutes.js";
import facultyRoutes from "./routes/facultyRoutes.js";
import facilityRoutes from "./routes/facilityRoutes.js";
import noticeRoutes from "./routes/noticeRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";

// ROUTES (declare but don't use until DB connects)
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/faculty", facultyRoutes);
app.use("/api/facilities", facilityRoutes);
app.use("/api/notices", noticeRoutes);
app.use("/api/chat", chatRoutes);

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 30000
    });

    console.log("✅ MongoDB Connected");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server Running on port ${PORT}`);
    });

  } catch (err) {
    console.error("❌ DB Connection Failed:", err.message);
  }
};

startServer();