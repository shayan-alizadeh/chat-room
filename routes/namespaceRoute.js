import express from "express";
import NamespaceController from "../controllers/namespaceController.js";

const router = express.Router();

router.get('/',NamespaceController.getAll)
router.post('/',NamespaceController.create)
router.post("/room", NamespaceController.createRoom);

export default router;
