import { Router } from "express";
import { create, getAll, getOne } from "./issues.controller";
import authenticate from "../../middleware/authenticate";

const router = Router();

router.get("/", getAll);
router.get("/:id", getOne);
router.post("/", authenticate, create);

export default router;