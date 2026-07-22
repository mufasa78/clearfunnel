import { Router } from "express";
import bcrypt from "bcryptjs";
// @ts-ignore — convex types are resolved at workspace root, not api-server scope
import { convex } from "../lib/convex.js";
// @ts-ignore — convex types are resolved at workspace root, not api-server scope
import { api } from "../../../../convex/_generated/api.js";
import { signToken } from "../lib/jwt.js";

const router = Router();

const SALT_ROUNDS = 12;

router.post("/register", async (req: any, res: any) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

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

    const user = await convex.query(api.users.getUserByEmail, { email });

    if (!user) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
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
