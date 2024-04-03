import express from "express";
import { getFoodsData, postFoodsData } from "../Controllers/foodsController.js";

const router = express.Router();
router.post("/foods", postFoodsData);
router.get("/veg-foods", getFoodsData);

export default router;
