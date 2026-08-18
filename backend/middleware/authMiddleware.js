import jwt from "jsonwebtoken";

export const verifyMechanic = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "Mechanic login required",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_ACCESS_SECRET
    );

    if (decoded.type !== "mechanic") {
      return res.status(403).json({
        error: "Forbidden",
        message: "Mechanic access only",
      });
    }

    req.mechanic = decoded;

    next();
  } catch (err) {
    console.error("verifyMechanic error:", err.message);

    return res.status(401).json({
      error: "Invalid token",
      message: "Please login again",
    });
  }
};