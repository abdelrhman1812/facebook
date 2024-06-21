// import multer from 'multer';
// import { cloudinaryUploadImage } from '../Cloudinary/cloudinary.js';
// import photoStorage from './storage.js';

// const photoUpload = multer({
//     storage: photoStorage,
//     fileFilter: (req, file, cb) => {
//         if (file.mimetype.startsWith('image')) {
//             cb(null, true);
//         } else {
//             cb({ message: 'Unsupported File Format' }, false);
//         }
//     },
//     limits: { fileSize: 1024 * 1024 } // 1MB file size limit
// });

// const upload = async (req, res) => {
//     photoUpload.single('image')(req, res, async (err) => {
//         if (err) {
//             console.error("Multer error:", err);
//             return res.status(400).json({ error: err.message });
//         }
//         if (!req.file) {
//             console.error("No file uploaded");
//             return res.status(400).json({ error: 'No file uploaded' });
//         }

//         console.log("File uploaded successfully:", req.file);

//         try {
//             const result = await cloudinaryUploadImage(req.file.path); // Assuming `req.file.path` contains the path to the uploaded file
//             console.log("Cloudinary upload result:", result);
//             return res.status(200).json({ message: 'Successfully uploaded', file: req.file, cloudinary: result });
//         } catch (uploadError) {
//             console.error("Cloudinary upload error:", uploadError);
//             return res.status(500).json({ error: 'Cloudinary upload failed', details: uploadError.message });
//         }
//     });
// };

// export default upload;
