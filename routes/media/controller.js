const express = require("express");
const router = express.Router();
const multer = require("multer");
const { Media } = require("../../models");
const cloudinary = require("../../utils/cloudinary");
const upload = require("../../middlewares/fileMulter");
const {
  updateDocument,
  findDocument,
  insertDocuments,
} = require("../../utils/MongoDbHelper");

module.exports = {
  uploadSingle: (req, res, next) =>
    // file => tên biến nhận từ FE
    upload.single("image")(req, res, async (err) => {
      cloudinary.uploader.upload(req.file.path, async (error, result) => {
        try {
          if (err instanceof multer.MulterError) {
            res.status(500).json({ type: "MulterError", err: err });
          } else if (error) {
            res.status(500).json({ type: "Upload file error", err: error });
          } else {
            const media = new Media({
              location: result.url,
              name: req.file.filename,
              customerId: req.user._id,
              size: req.file.size,
            });

            const response = await media.save();

            res
              .status(200)
              .json({ message: "upload successfully", payload: response });
          }
        } catch (error) {
          res.status(500).json({ message: "Upload file error", error });
        }
      });
    }),

  uploadMultiple: (req, res) =>
    upload.array("images", 5)(req, res, async (err) => {
      try {
        if (err instanceof multer.MulterError) {
          res.status(500).json({ type: "MulterError", err: err });
        } else if (err) {
          res.status(500).json({ type: "UnknownError", err: err });
        } else {
          const files = req.files;

          // Tạo một mảng promises để upload tất cả file lên Cloudinary
          const uploadPromises = files.map((file) => {
            return cloudinary.uploader.upload(file.path, {
              folder: "nodejs_images",
            });
          });
          // Chờ cho tất cả upload hoàn tất
          const results = await Promise.all(uploadPromises);

          const dataInsert = results.map((result, index) => ({
            location: result.secure_url,
            name: files[index].filename,
            size: files[index].size,
            customerId: req.user._id,
          }));

          const response = await insertDocuments(dataInsert, "Media");

          return res
            .status(200)
            .json({ message: "Tải lên thành công", payload: response });
        }
      } catch (error) {
        console.log("««««« error »»»»»", error);
        res.status(500).json({ message: "Upload files error", error });
      }
    }),

  getDetail: async (req, res, next) => {
    const { id } = req.params;
    console.log(id);
    const payload = await Media.findById(id);

    if (payload) return res.status(200).json({ payload });

    return res.status(400).json({ message: "Không tìm thấy" });
  },

  update: async (req, res) => {
    const { id } = req.params;

    const found = await findDocument(id, "Media");
    if (!found)
      res
        .status(410)
        .json({ message: `${collectionName} with id ${id} not found` });

    upload.single("file")(req, res, async (err) => {
      try {
        if (err instanceof multer.MulterError) {
          res.status(500).json({ type: "MulterError", err: err });
        } else if (err) {
          res.status(500).json({ type: "UnknownError", err: err });
        } else {
          // Media.findByIdAndUpdate()
          const response = await updateDocument(
            { _id: id },
            {
              location: req.file.path,
              name: req.file.filename,
              customerId: req.user._id,
              size: req.file.size,
            },
            "Media"
          );
          const updatedDocument = await findDocument(id, "Media");
          if (response) {
            res.status(200).json({ ok: true, payload: updatedDocument });
          }
          return res
            .status(400)
            .json({ ok: true, payload: { message: "Update failed" } });
        }
      } catch (error) {
        res.status(500).json({ ok: false, error });
      }
    });
  },
};
