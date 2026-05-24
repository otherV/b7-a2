import { Router } from "express";
import { create, getAll, getOne, update } from "./issues.controller";
import authenticate from "../../middleware/authenticate";

const router = Router();

router.get("/", getAll);
router.get("/:id", getOne);
router.post("/", authenticate, create);
router.patch("/:id", authenticate, update);

export default router;