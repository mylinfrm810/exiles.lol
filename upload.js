const multer = require('multer');
const path = require('path');
const { nanoid } = require('nanoid');

function makeStorage(subfolder) {
  return multer.diskStorage({
    destination: path.join(__dirname, '..', 'uploads', subfolder),
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      cb(null, `${nanoid(12)}${ext}`);
    }
  });
}

const avatarUpload = multer({
  storage: makeStorage('avatars'),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) return cb(new Error('Avatar must be an image'));
    cb(null, true);
  }
});

const backgroundUpload = multer({
  storage: makeStorage('backgrounds'),
  limits: { fileSize: 30 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/') && !file.mimetype.startsWith('video/')) {
      return cb(new Error('Background must be an image or video'));
    }
    cb(null, true);
  }
});

const audioUpload = multer({
  storage: makeStorage('audio'),
  limits: { fileSize: 15 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('audio/')) return cb(new Error('Must be an audio file'));
    cb(null, true);
  }
});

module.exports = { avatarUpload, backgroundUpload, audioUpload };
