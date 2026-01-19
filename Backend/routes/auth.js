import express from "express";
import { loginValidation,signupValidation } from "../middleware/authValidation.js";
import { login, signup } from "../controllers/authController.js";


const router = express.Router();

router.post('/login', loginValidation, login);
router.post('/signup', signupValidation, signup);

export default router;