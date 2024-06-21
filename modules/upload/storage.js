// import multer from 'multer';
// import path from 'path';
// import { fileURLToPath } from 'url';

// // Get the __dirname equivalent in ES6 modules
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const photoStorage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, path.join(__dirname, '../image')); // Ensure this path is correct and writable
//     },
//     filename: (req, file, cb) => {
//         if (file) {
//             cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname);
//         } else {
//             cb(null, false);
//         }
//     }
// });

// export default photoStorage;
