import { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import File from '../models/file.model';

// Setup multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // The folder where uploaded files will be saved
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Give file a unique name
  },
});

const upload = multer({ storage: storage });

// File upload controller
export const uploadFile = upload.single('file'); // Middleware to handle file upload

export const handleUpload = async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded');
  }

  try {
    // Create file data in MongoDB
    const file = new File({
      filename: req.file.filename,
      path: `uploads/${req.file.filename}`, // Correct path to the uploaded file
      size: req.file.size,
      mimetype: req.file.mimetype,
    });

    console.log(`File uploaded: ${req.file.filename}`); // Log the uploaded file

    // Save file data
    await file.save();

    res.status(200).json({
      message: 'File uploaded successfully',
      file: {
        filename: file.filename,
        path: file.path,
        size: file.size,
        mimetype: file.mimetype,
      },
    });
  } catch (err) {
    res.status(500).send('Error saving file data');
  }
};

export const downloadFile = async (req: Request, res: Response) => {
  try {
    // Find the file in the database by its filename or ID
    const fileId = req.params.id;
    const file = await File.findById(fileId);

    if (!file) {
      return res.status(404).send('File not found');
    }

    const filePath = path.join(__dirname, '..', '..', file.path); // Absolute path to the file on the server

    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).send('File not found on server');
    }

    // Set headers for file download
    res.setHeader('Content-Disposition', `attachment; filename=${file.filename}`);
    res.setHeader('Content-Type', file.mimetype);

    // Stream the file to the client
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } catch (err) {
    res.status(500).send('Error downloading file');
  };
};