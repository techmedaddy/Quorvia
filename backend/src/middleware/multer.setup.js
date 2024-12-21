const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Save files to the uploads directory
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedFileTypes = ['image/jpeg', 'image/png', 'application/pdf', 'text/plain'];

  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, PDF, and TXT files are allowed.'), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter,
}).single('file'); // Expect a single file under the field name 'file'

const uploadMiddleware = (req, res, next) => {
  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      console.error('Multer error:', err.message);
      return res.status(400).json({ message: `File upload error: ${err.message}` });
    } else if (err) {
      console.error('File filter error:', err.message);
      return res.status(400).json({ message: `Invalid file: ${err.message}` });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded. Please attach a valid file.' });
    }

    next();
  });
};

module.exports = uploadMiddleware;