const express = require("express");
const router = express.Router();
const {
    getMedias,
    getMediaById,
    createMedia,
    updateMedia,
    deleteMedia
} = require("./mediascontroller");

router.get("/", getMedias);
router.get("/:id", getMediaById);
router.post("/", createMedia);
router.put("/:id", updateMedia);
router.delete("/:id", deleteMedia);

module.exports = router;
