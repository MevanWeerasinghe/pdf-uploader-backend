const mongoose = require("mongoose");

const pdfSchema = new mongoose.Schema({
  title: { type: String, required: true },
  path: { type: String, required: true },
  uploader: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  uploadDate: { type: Date, default: Date.now },
});

const PDF = mongoose.model("PDF", pdfSchema);

module.exports = PDF;
