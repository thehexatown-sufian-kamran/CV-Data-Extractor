import express from "express";
import multer from "multer";
import cors from "cors";
import fs from "fs";
import * as pdfjsLib from "pdfjs-dist";
import mammoth from "mammoth";
import extractInformationFromRawResumeText from "./resumeExtractor.js";
// import nlp from 'compromise';

const app = express();
const port = 5000;

app.use(cors());

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

// Function to extract text from PDF
const extractTextFromPDF = async (filePath) => {
  const pdf = await pdfjsLib.getDocument(filePath).promise;
  let extractedText = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items.map((item) => item.str).join(" ");
    extractedText += pageText + "\n";
  }

  return extractedText;
};

// Function to extract text from .doc or .docx using mammoth
const extractTextFromDoc = async (filePath) => {
  const fileBuffer = fs.readFileSync(filePath);
  const { value: text } = await mammoth.extractRawText({ buffer: fileBuffer });
  return text || "Could not extract text from the document.";
};

// Upload route
app.post("/upload", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  try {
    const filePath = req.file.path;
    const fileType = req.file.mimetype;

    let text = "";

    if (fileType === "application/pdf") {
      text = await extractTextFromPDF(filePath);
    } else if (
      fileType === "application/msword" ||
      fileType ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      text = await extractTextFromDoc(filePath);
    } else {
      return res.status(400).json({ message: "Unsupported file type" });
    }

    const { name, email, phone, profession } =
      extractInformationFromRawResumeText(text);

    res.status(200).json({
      message: "File uploaded and processed successfully",
      name,
      email,
      phone,
      profession,
    });
  } catch (error) {
    console.error("Error processing file:", error);
    res.status(500).json({ message: "Error processing file" });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
