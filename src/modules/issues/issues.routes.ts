import { Router } from "express";
import { create, getAll } from "./issues.controller";
import authenticate from "../../middleware/authenticate";

const router = Router();

router.get("/", getAll);
router.post("/", authenticate, create);

export default router;