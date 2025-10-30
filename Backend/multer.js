import multer from "multer";
import path from "path";

// Set up storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads/"); // destination for storing uploaded files
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // unique filename with extension
    }
});

// File filter to accept only image files
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true); // Accept the file
    } else {
        cb(new Error("Only images are allowed"), false); // Reject the file
    }
};

// Initialize multer instance with storage and file filter
const upload = multer({
    storage: storage,
    fileFilter: fileFilter
});

export default upload;
