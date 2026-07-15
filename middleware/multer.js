import multer from "multer";
import fs from "fs";
import path from "path";

export function multerStorage(destination, allowTypes = /jpg|jpeg|png/) {
  if (!fs.existsSync(destination)) {
    fs.mkdirSync(destination, { recursive: true });
  }
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, destination);
    },
    filename: (req, file, cb) => {
      const randomName = Math.floor(Math.random() * 999_999);
      const ext = path.extname(file.originalname);
      cb(null, `${randomName}${ext}`);
    },
  });

  fileFilter = (req, file, cb) => {
    if (allowTypes.test(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("File type not allowed !!!"));
    }
  };
  const upload = multer({
    storage,
    limits: { fileSize: 512_000_000 },
    fileFilter,
  });

  return upload;
}
