const express = require("express");
const router = express.Router();
const googleController = require("../controllers/googleController");
const facebookController = require("../controllers/facebookController");

router.get("/google", googleController.login);
router.get("/google/redirect", googleController.callback);
router.get("/google/success", googleController.success);
router.get("/google/failure", googleController.fail);
router.get("/facebook", facebookController.login);
router.get(
  "/facebook/redirect",
  facebookController.callback.fail,
  facebookController.callback.success
);

module.exports = router;
