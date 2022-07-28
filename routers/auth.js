const express = require("express");
const router = express.Router();
const googleController = require("../controllers/googleController");

router.get("/google", googleController.login);
router.get("/google/redirect", googleController.callback);
router.get("/google/success", googleController.success);
router.get("/google/failure", googleController.fail);

module.exports = router;
