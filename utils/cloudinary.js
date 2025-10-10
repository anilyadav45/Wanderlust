import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();


cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_SECRET
});

export const uploadOnCloudinary = async (filePath) => {
    if (!filePath) return null;
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            folder: 'Wanderlust',
        });
        fs.unlinkSync(filePath); // delete temp local file
        console.log("Uploaded to Cloudinary:", result.url);
        return result.url; // return uploaded image URL
    } catch (err) {
        fs.unlinkSync(filePath);
        console.error(" Cloudinary upload failed:", err);
        return null;
    }
};
