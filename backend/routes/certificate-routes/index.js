// routes/certificateRoutes.js
import express from "express";
import { generateCertificateAPI } from "../controllers/certificateController.js";

const router = express.Router();

router.get("/generate/:enrollmentId", generateCertificateAPI);

export default router;
