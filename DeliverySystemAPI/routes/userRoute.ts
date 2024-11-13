import express from "express";
import { isAdmin, isSelfOrAdmin } from "../middleware";
import { User } from "../models";
import { hashPassword } from "../utils";

export const userRoutes = express.Router();

// Get all users
userRoutes.get("/users", isAdmin, async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

//Get user by id
userRoutes.get("/users/:id", isSelfOrAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

//update single user
userRoutes.put("/users/:id", isSelfOrAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);

    const { firstName, lastName, email, password, phoneNumber } = req.body;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    let hashedPassword = user.password;
    if (password) hashedPassword = hashPassword(password);

    user.update({
      firstName: firstName && firstName === "" ? user.firstName : firstName,
      lastName: lastName && lastName === "" ? user.lastName : lastName,
      email: email && email === "" ? user.email : email,
      password: password && password === "" ? user.password : hashedPassword,
      phoneNumber:
        phoneNumber && phoneNumber === "" ? user.phoneNumber : phoneNumber,
    });

    res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    res.status(500).json({ error });
  }
});
