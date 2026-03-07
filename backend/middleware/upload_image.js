import multer from "multer";
import path from "path";
//multer--->biblio pour telecharger les donner(image,pdf=file)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload_image = multer({
  storage: storage,
});

export default upload_image;