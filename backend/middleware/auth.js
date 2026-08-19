import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  try {
    const authHeader =
      req.headers.authorization;

    if (
      !authHeader ||
      !authHeader.startsWith("Bearer ")
    ) {
      return res.status(401).json({
        message: "No token provided",
      });
    }

    const token =
      authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "No token provided",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_ACCESS_SECRET
    );

    if (
      !decoded.id ||
      decoded.type !== "user"
    ) {
      return res.status(401).json({
        message: "Invalid user token",
      });
    }

    req.user = decoded;

    next();
  } catch (err) {
    console.error(
      "Auth error:",
      err.message
    );

    return res.status(401).json({
      message:
        "Invalid or expired token",
    });
  }
};