import jwt from "jsonwebtoken";

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET environment variable is required");
  }
  return secret;
};

export interface JwtPayload {
  userId: string;
  email: string;
}

// Generate a JWT token for a user
export const signToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, getJwtSecret(), {
    algorithm: "HS256",
    expiresIn: "1h", // Token expiration
  });
};

// Verify and decode a JWT token
export const verifyToken = (token: string): JwtPayload => {
  try {
    const decoded = jwt.verify(token, getJwtSecret(), {
      algorithms: ["HS256"], // Strictly enforce algorithm to prevent 'none' algorithm bypass
    });
    return decoded as JwtPayload;
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
};
