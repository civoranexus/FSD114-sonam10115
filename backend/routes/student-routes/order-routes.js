const express = require("express");
const {
    createOrder,
    capturePaymentAndFinalizeOrder,
} = require("../../controller/student-controller/order-controller");

const router = express.Router();

router.post("/create", createOrder);
router.post("/capture", capturePaymentAndFinalizeOrder);

module.exports = router;