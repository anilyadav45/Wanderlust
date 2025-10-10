import multer from 'multer';
import path from 'path';
import fs from 'fs';

// this middware upload file in public/tempUploads
const tempDir = path.join(process.cwd(), 'public/tempUploads');
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, tempDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

export const upload = multer({ storage });
