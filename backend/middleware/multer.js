const multer = require('multer');

const whitelist = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    checkFileType(req, file, cb);
  }
});

const checkFileType = (req, file, cb) => {
  if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|webp|WEBP)$/)) {
    req.fileValidationError = new Error('Only images are allowed!');
    return cb(null, false, req.fileValidationError);
  }
  if (!whitelist.includes(file.mimetype)) {
    req.fileValidationError = new Error('Only images are allowed!');
    return cb(null, false, req.fileValidationError);
  }
  return cb(null, true);
};


module.exports = upload