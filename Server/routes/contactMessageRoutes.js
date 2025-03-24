const express = require("express");
const router = express.Router();
const contactMessageController = require("../controllers/contactMessageController");

router.post("/create/contact-messages", contactMessageController.createMessage);

module.exports = router;
