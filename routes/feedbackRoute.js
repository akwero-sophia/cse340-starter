const express = require("express");
const router = express.Router();
const feedbackController = require("../controllers/feedbackController");

router.get("/", (req, res) => {
  res.render("feedback/feedback", {
    error: null,
    success: null,
    name: "",
    email: "",
    message: "",
  });
});

router.post("/", feedbackController.postFeedback);

module.exports = router;
