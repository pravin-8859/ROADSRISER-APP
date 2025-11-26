import jwt from "jsonwebtoken";

export const createAccessToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_ACCESS_SECRET, { expiresIn: "15m" });
};

export const createRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
};
