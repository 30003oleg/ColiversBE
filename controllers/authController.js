import User from "../models/User.js";
import Role from "../models/Role.js";
import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../config.js";

export const registration = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: "Registration error", errors });
    }

    const { username, password } = req.body;
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      res
        .status(400)
        .json({ message: "User with same username already exists" });
    }
    const userRole = await Role.findOne({ value: "User" });
    bcrypt.hash(password, 8, async (err, hashedPassword) => {
      if (err) {
        console.error("Error in hash generation", err);
        return;
      }
      const user = new User({
        username,
        password: hashedPassword,
        roles: [userRole.value],
      });
      await user.save();
      return res.json({ message: "User created" });
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Registration error" });
  }
};

export const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: "Login error", errors });
    }

    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      res.status(400).json({ message: "User doesn't exist" });
    }
    bcrypt.compare(password, user.password, async (err, isPasswordCorrect) => {
      if (err) {
        console.log("Hash error", err);
        return;
      }
      if (!isPasswordCorrect)
        return res.status(400).json({ message: "Password is incorrect" });
    });
    const token = jwt.sign(
      {
        id: user._id,
        roles: user.roles,
      },
      SECRET_KEY,
      { expiresIn: "30d" }
    );
    return res.json({ token });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Loggin error" });
  }
};

export const createRoles = async (req, res) => {
  try {
    const userRole = new Role();
    const adminRole = new Role({ value: "Admin" });
    await adminRole.save();
    await userRole.save();
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Error creating Users" });
  }
};
