import multer from "multer";
import { __dirname } from '../dirname.js';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log(file)
    if (file.originalname.includes('profileImage')) {
      cb(null, __dirname + "/public/uploads/profiles/");
    } else if (file.originalname.includes('productImage')) {
      cb(null, __dirname + "/public/uploads/products/");
    } else {
      cb(null, __dirname + "/public/uploads/documents/");
    }
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

export const uploader = multer({ storage });
