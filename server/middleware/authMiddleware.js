import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // 🔍 Debug log (add this temporarily)
  

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).send("No token provided");
  }

  try {
    const token = authHeader.split(" ")[1]; // remove "Bearer "
    

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    next();
  } catch (err) {
    console.error("JWT VERIFY FAILED:", err.message);
    return res.status(401).send("Invalid token");
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).send("Admin only");
  }
  next();
};