import jwt from "jsonwebtoken";

export const createAdminAccessToken = (id) => {
  return jwt.sign(
    {
      id: String(id),
      type: "admin",
    },
    process.env.JWT_ACCESS_SECRET,
    {
      expiresIn: "15m",
    }
  );
};

export const createAdminRefreshToken = (id) => {
  return jwt.sign(
    {
      id: String(id),
      type: "admin",
    },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: "7d",
    }
  );
};