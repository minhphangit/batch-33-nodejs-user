const express = require("express");
const router = express.Router();
const cloudinary = require("../../utils/cloudinary");
const upload = require("../../middlewares/fileMulter");
const {
  uploadSingle,
  uploadMultiple,
  getDetail,
  update,
} = require("./controller");
router.post("/upload-single", uploadSingle);
router.post("/upload-multiple", uploadMultiple);
router.get("/:id", getDetail);
router.post("/:id", update);

module.exports = router;
