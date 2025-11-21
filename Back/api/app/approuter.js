const express = require("express");
const router = express.Router();

const { registerApp, loginApp, getAppInfo, refreshToken } = require("../app/appcontroller");

router.post("/register", registerApp);
router.post("/login", loginApp);
router.get("/info", getAppInfo);
router.post("/refresh-token", refreshToken);

module.exports = router;