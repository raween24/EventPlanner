import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "termsFile") {
      cb(null, "uploads/docs/");
    } else if (file.fieldname === "media") {
      cb(null, "uploads");
    }
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  if (file.fieldname === "termsFile") {
    const allowed = /pdf/;
    const valid = allowed.test(file.mimetype);
    return valid ? cb(null, true) : cb("PDF seulement !");
  }

  if (file.fieldname === "media") {
    const allowed = /jpg|jpeg|png/;
    const valid = allowed.test(file.mimetype);
    return valid ? cb(null, true) : cb("Images seulement !");
  }
};

const upload = multer({
  storage,
limits: { fileSize: 20 * 1024 * 1024 } ,
  fileFilter
});

export default upload;