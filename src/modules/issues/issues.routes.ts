import { Router } from "express";
import { create } from "./issues.controller";
import authenticate from "../../middleware/authenticate";

const router = Router();

router.post("/", authenticate, create);

export default router;