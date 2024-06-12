const multer = require("multer");
const path = require("path");
const PDF = require("../models/PDF");
const asyncHandler = require("express-async-handler");

// Set up multer storage
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Set up multer upload
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true); // Accept the file
    } else {
      cb(new Error("Only PDFs are allowed"), false); // Reject the file
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 },
}).single("pdf");

//desc Upload a PDF
//route POST /api/pdf/upload
//access Private
const uploadPDF = asyncHandler(async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      res.status(400);
      throw new Error(`Error: ${err.message}`);
    }

    const newPDF = new PDF({
      title: req.body.title,
      path: req.file.path,
      uploader: req.user._id,
    });

    await newPDF.save();
    res.status(201).json(newPDF);
  });
});

//desc Get all PDFs
//route GET /api/pdf
//access Private
const getPDFs = asyncHandler(async (req, res) => {
  const pdfs = await PDF.find({ uploader: req.user._id });
  res.json(pdfs);
});

//desc Get a PDF
//route GET /api/pdf/:id
//access Private
const getPDF = asyncHandler(async (req, res) => {
  const pdf = await PDF.findById(req.params.id);
  if (!pdf) {
    res.status(404);
    throw new Error("PDF not found");
  }
  res.sendFile(path.resolve(pdf.path));
});

module.exports = { uploadPDF, getPDFs, getPDF };
