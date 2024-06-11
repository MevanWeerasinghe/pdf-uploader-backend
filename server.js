const express = require("express");
const dotenv = require("dotenv").config();
const morgan = require("morgan");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const pdfRoutes = require("./routes/pdfRoutes");
const logger = require("./middleware/logger");
const connectDB = require("./config/dbConnection");

connectDB();
const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan("combined", { stream: logger.stream }));

app.use("/api/auth", authRoutes);
app.use("/api/pdfs", pdfRoutes);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
