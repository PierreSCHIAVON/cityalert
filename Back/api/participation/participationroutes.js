const express = require("express");
const {
  createParticipation,
  getParticipations,
} = require("./participationcontroller");

const router = express.Router();

router.post("/", createParticipation);
router.get("/", getParticipations);

module.exports = router;
