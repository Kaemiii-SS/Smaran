import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

console.log("Cloudinary API Key Loaded:", !!process.env.CLOUDINARY_API_KEY);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'demo',
  api_key: process.env.CLOUDINARY_API_KEY || 'dummy_key',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'dummy_secret'
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    allowedFormats: ['jpeg', 'png', 'jpg'],
  },
});

export const upload = multer({ storage: storage });
