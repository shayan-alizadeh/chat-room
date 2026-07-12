import express from "express";
import NamespaceController from "../controllers/namespaceController";

const router = express.Router();

router.get('/',NamespaceController.getAll)
router.post('/',NamespaceController.create)

export default router;
