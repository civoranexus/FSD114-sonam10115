const express = require("express");
const {
    registerUser,
    loginUser, logoutUser
} = require("../../controller/auth-controller/index");
const authenticateMiddleware = require("../../middleware/auth-middleware");
const { arcjetProtection } = require("../../middleware/arcjet.middleware.js");

const router = express.Router();

router.use(arcjetProtection);

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/check-auth", authenticateMiddleware, (req, res) => {
    const user = req.user;

    res.status(200).json({
        success: true,
        message: "Authenticated user!",
        data: {
            user,
        },
    });
});

module.exports = router;