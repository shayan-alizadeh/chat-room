import express from "express";
import { UserController } from "../controllers/userController";

const router = express.Router();

router.get("/me", UserController.me);
router.post("/", UserController.register);

export default router;
