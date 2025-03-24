const { ContactMessage } = require("../models");

exports.createMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res
        .status(400)
        .json({ error: "Name, email, and message are required" });
    }

    const newMessage = await ContactMessage.create({
      name,
      email,
      message,
    });

    res
      .status(201)
      .json({ message: "Message created successfully", data: newMessage });
  } catch (error) {
    console.error("Error creating message:", error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the message" });
  }
};
