const express = require("express");
const router = express.Router();
const {
    getMedia,
    getMediaById,
    createMedia,
    updateMedia,
    deleteMedia
} = require("./mediacontroller");

router.get("/", getMedia);
router.get("/:id", getMediaById);
router.post("/", createMedia);
router.put("/:id", updateMedia);
router.delete("/:id", deleteMedia);

module.exports = router;
