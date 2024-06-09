const multer = require("multer");
const path = require("path");
const PDF = require("../models/PDF");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDFs are allowed"), false);
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 },
}).single("pdf");

const uploadPDF = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    const newPDF = new PDF({
      title: req.body.title,
      path: req.file.path,
      uploader: req.user._id,
    });

    try {
      await newPDF.save();
      res.status(201).json(newPDF);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
};

const getPDFs = async (req, res) => {
  try {
    const pdfs = await PDF.find().populate("uploader", "username");
    res.json(pdfs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getPDF = async (req, res) => {
  try {
    const pdf = await PDF.findById(req.params.id);
    if (!pdf) {
      return res.status(404).json({ message: "PDF not found" });
    }
    res.sendFile(path.resolve(pdf.path));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { uploadPDF, getPDFs, getPDF };
