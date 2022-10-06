import express from "express";
import { check } from "express-validator";
import { authController } from "../controllers/index.js";

export const router = express();
router.post(
  "/registration",
  [
    check("username", "Username shold not be empty").notEmpty(),
    check(
      "password",
      "Password's length has to be more than 6 and less than 12 symbols"
    ).isLength({ min: 6, max: 12 }),
  ],
  authController.registration
);
router.post("/login", authController.login);
router.get("/createRoles", authController.createRoles);
