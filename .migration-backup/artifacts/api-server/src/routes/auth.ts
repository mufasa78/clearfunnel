import { Router, Request, Response } from "express";
import { convex } from "../lib/convex.js";
import { signToken } from "../lib/jwt.js";
import { api } from "../../../../convex/_generated/api.js";

const router = Router();

router.post("/register", async (req: any, res: any) => {
  try {
    const { email, password, name } = req.body;
    
    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }

    // Hash password here in a real app (e.g. bcrypt). For demo purposes we simulate it.
    const passwordHash = `hashed_${password}`;

    // Create user via Convex mutation
    const userId = await convex.mutation(api.users.createUser, {
      email,
      passwordHash,
      name,
    });

    const token = signToken({ userId, email });
    
    res.json({ token, userId });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/login", async (req: any, res: any) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }

    // Retrieve user via Convex query
    const user = await convex.query(api.users.getUserByEmail, { email });

    if (!user) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    const passwordHash = `hashed_${password}`;

    if (user.passwordHash !== passwordHash) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    const token = signToken({ userId: user._id, email: user.email });
    
    res.json({ token, userId: user._id });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
