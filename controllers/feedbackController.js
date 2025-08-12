const { insertFeedback } = require("../models/feedback-model");

async function postFeedback(req, res) {
  const { name, email, message } = req.body;

  // Server-side validation
  if (!name || !email || !message) {
    return res.render("feedback/feedback", {
      error: "All fields are required.",
      name,
      email,
      message,
    });
  }

  try {
    const result = await insertFeedback(name, email, message);
    if (result.success) {
      return res.render("feedback/feedback", {
        success: "Thanks for your feedback!",
        name: "",
        email: "",
        message: "",
      });
    } else {
      return res.render("feedback/feedback", {
        error: result.error,
        name,
        email,
        message,
      });
    }
  } catch (err) {
    return res.render("feedback/feedback", {
      error: "Server error. Try again later.",
      name,
      email,
      message,
    });
  }
}

module.exports = { postFeedback };
