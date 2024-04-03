import express from "express";
import {
  ValidateResetCode,
  forgetPassword,
  getValidateToken,
  loginUser,
  passwordReset,
  postRegister,
} from "../Controllers/userController.js";

const router = express.Router();

router.post("/register", postRegister);
router.post("/login", loginUser);
router.post("/forgetpassword", forgetPassword);
router.post("/resetpassword", passwordReset);
router.get("/validate-token", getValidateToken);
router.get("/validateresetcode/:code", ValidateResetCode);

export default router;
