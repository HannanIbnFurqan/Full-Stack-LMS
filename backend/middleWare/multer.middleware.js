import path from 'path';
import multer from 'multer';

const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (_req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    },
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        if (!['.jpg', '.jpeg', '.webp', '.png', '.mp4'].includes(ext)) {
            cb(new Error('Unsupported file type! Only JPG, JPEG, WEBP, PNG, and MP4 are allowed.'), false);
            return;
        }
        cb(null, true);
    },
});

export default upload;
