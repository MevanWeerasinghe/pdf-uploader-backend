const express = require("express");
const { uploadPDF, getPDFs, getPDF } = require("../controllers/pdfController");
const { requireAuth } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/upload", requireAuth, uploadPDF);
router.get("/", requireAuth, getPDFs);
router.get("/:id", requireAuth, getPDF);

module.exports = router;
