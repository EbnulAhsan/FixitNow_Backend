import express from "express";

const router = express.Router();

router.post("/register", (req, res) => {
    res.status(201).json({
        success: true,
        message: "User registration route working",
    });
});

export const AuthRoutes = router;