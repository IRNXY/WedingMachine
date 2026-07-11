const express = require("express");

const router = express.Router();

const controller = require("../controllers/machine_controller");

router.get("/", controller.get_machine_state);
router.post("/restock", controller.restock);
router.post("/insert", controller.insert_coins);
router.post("/select", controller.buy_product);
router.post("/maintain", controller.maintain);

module.exports = router;