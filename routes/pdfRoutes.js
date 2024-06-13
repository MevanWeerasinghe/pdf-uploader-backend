const express = require("express");
const {
  uploadPDF,
  getPDFs,
  getPDF,
  searchPDF,
  deletePDF,
} = require("../controllers/pdfController");
const { requireAuth } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/upload", requireAuth, uploadPDF);
router.get("/", requireAuth, getPDFs);
router.get("/:id", requireAuth, getPDF);
router.get("/search/:title", requireAuth, searchPDF);
router.delete("/:id", requireAuth, deletePDF);

module.exports = router;
