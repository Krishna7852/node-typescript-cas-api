import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { uploadFile, handleUpload, downloadFile } from '../controllers/file.controller';

const router = Router();

// File upload route
router.post('/upload', uploadFile, handleUpload);

// File download route
router.get('/download/:filename',authenticate, downloadFile);

export { router as fileRouter };
