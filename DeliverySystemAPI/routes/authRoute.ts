import express from "express";
import { Error } from "sequelize";
import AuthFacade from "../Services/AuthFacade";

export const authRoutes = express.Router();

authRoutes.post("/register", async (req, res) => {
  try {
    await AuthFacade.register(req.body);
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    const err = error as Error;
    res.status(400).json({ error: err.message });
  }
});

authRoutes.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await AuthFacade.login(email, password);
    res.status(200).json(result);
  } catch (error) {
    const err = error as Error;
    res.status(400).json({ error: err.message });
  }
});

authRoutes.post("/logout", async (req, res) => {
  try {
    const accessToken = req.header("Authorization");
    if (!accessToken) {
      res.status(400).json({ error: "Missing token" });
      return;
    }

    await AuthFacade.logout(accessToken);
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    const err = error as Error;
    res.status(400).json({ error: err.message });
  }
});
