const multer = require('multer');

// Mocked upload setup since we aren't hooking up Cloudinary real SDK yet for the mocked version.
// In production, this would use multer-storage-cloudinary
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image') || file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Not an image or PDF! Please upload only images or PDFs.'), false);
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter
});

module.exports = upload;
