const multer = require("multer");
const path = require("path");
const PDF = require("../models/PDF");
const asyncHandler = require("express-async-handler");
const fs = require("fs").promises;

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

//desc Search PDFs by title
//route GET /api/pdf/search/:title
//access Private
const searchPDF = asyncHandler(async (req, res) => {
  const { title } = req.params;
  if (!title) {
    res.status(400);
    throw new Error("Please provide a title to search");
  }
  const pdfs = await PDF.find({
    uploader: req.user._id,
    title: { $regex: title, $options: "i" }, // Case insensitive search
  });
  res.json(pdfs);
});

//desc Delete a PDF
//route DELETE /api/pdf/:id
//access Private
const deletePDF = asyncHandler(async (req, res) => {
  try {
    const pdf = await PDF.findById(req.params.id);
    if (!pdf) {
      res.status(404).json({ message: "PDF not found" });
      return;
    }

    // Check if the logged in user is the uploader
    if (pdf.uploader.toString() !== req.user._id.toString()) {
      res.status(401).json({ message: "Not authorized to delete this PDF" });
      return;
    }

    const filePath = path.resolve(pdf.path);

    // Delete the PDF file from the file system
    await fs.unlink(filePath);

    // Remove the document from the database
    await PDF.deleteOne({ _id: req.params.id });

    res.json({ message: "PDF removed" });
  } catch (err) {
    console.error(`Error deleting PDF: ${err.message}`);
    res.status(500).json({
      message: "Failed to delete the file or document",
      error: err.message,
    });
  }
});

module.exports = { uploadPDF, getPDFs, getPDF, searchPDF, deletePDF };
