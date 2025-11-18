const express = require("express");
const router = express.Router();
const {
    getMedias,
    getMediasById,
    createMedias,
    updateMedias,
    deleteMedias
} = require("./mediascontroller");

router.get("/", getMedias);
router.get("/:id", getMediasById);
router.post("/", createMedias);
router.put("/:id", updateMedias);
router.delete("/:id", deleteMedias);

module.exports = router;
