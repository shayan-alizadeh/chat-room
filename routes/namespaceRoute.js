import express from "express";
import NamespaceController from "../controllers/namespaceController.js";
import { multerStorage } from "../middlewares/multer.js";

const router = express.Router();

const uploader = multerStorage("public/rooms");

router.get("/", NamespaceController.getAll);
router.post("/", NamespaceController.create);
router.post("/room", uploader.single("media"), NamespaceController.createRoom);

export default router;
