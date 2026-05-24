import { Router } from "express";
import { create, getAll, getOne, update, changeStatus, remove } from "./issues.controller";
import authenticate from "../../middleware/authenticate";
import authorize from "../../middleware/authorize";

const router = Router();

router.get("/", getAll);
router.get("/:id", getOne);
router.post("/", authenticate, create);
router.patch("/:id", authenticate, update);
router.patch("/:id/status", authenticate, authorize("maintainer"), changeStatus);
router.delete("/:id", authenticate, authorize("maintainer"), remove);

export default router;