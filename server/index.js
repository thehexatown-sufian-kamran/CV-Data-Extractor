//REGEX

import express from "express";
import multer from "multer";
import cors from "cors";
import fs from "fs";
import * as pdfjsLib from "pdfjs-dist";

const app = express();
const port = 5000;

app.use(cors());

const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

// Function to extract text from PDF using pdf.js
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

// Utilities
const extractName = (text) => {
  const nameRegex = /([A-Z][a-z]*\s[A-Z][a-z]*)/; // Match first and last name
  const name = text.match(nameRegex)?.[0] || "Name not found";
  return name;
};

const extractEmail = (text) => {
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
  const email = text.match(emailRegex)?.[0] || "Email not found";
  return email;
};

const extractPhone = (text) => {
  const phoneRegex =
    /\+?[0-9]{1,4}?[-.\s]?[0-9]{1,4}[-.\s]?[0-9]{1,4}[-.\s]?[0-9]{1,9}/g;
  const phone = text.match(phoneRegex)?.[0] || "Phone number not found";
  return phone;
};

const extractProfession = (text) => {
  const professionRegex =
    /(app developer|web developer|fullstack developer|MERN|software engineer|designer|manager|analyst|administrator|programmer)/i;
  const profession = text.match(professionRegex)?.[0] || "Profession not found";
  return profession;
};

// Function to extract name, email, phone number, and profession 
const extractInformationFromRawResumeText = (text) => {

  return { name: extractName(text), email: extractEmail(text), phone: extractPhone(text), profession: extractProfession(text) };
};

app.post("/upload", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  try {
    const filePath = req.file.path;

    // Extract text from PDF
    const text = await extractTextFromPDF(filePath);

    // Save the text to a .txt file
    const txtFilePath = `${filePath}.txt`;
    fs.writeFileSync(txtFilePath, text, "utf-8");

    // Extract name, email, phone number, and profession
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
