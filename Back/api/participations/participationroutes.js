const express = require("express");
const router = express.Router();
const {
  getParticipations,
  createParticipation,
  updateParticipation,
  deleteParticipation,
} = require("./participationcontroller");

router.get("/", getParticipations);
router.post("/", createParticipation);
router.put("/:id_participation/:user_id", updateParticipation);
router.delete("/:id_participation/:user_id", deleteParticipation);

module.exports = router;
