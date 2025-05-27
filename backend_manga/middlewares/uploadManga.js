import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../utils/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: "manga/covers",
    public_id: file.originalname.replace(/\.[^/.]+$/, ""),
    format: file.mimetype.split("/")[1],
    transformation: [{ width: 800, crop: "limit" }],
  }),
});

const uploadManga = multer({ storage });

export default uploadManga;