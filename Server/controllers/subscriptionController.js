const { Subscription } = require("../models");

const getAllSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.findAll();
    res.status(200).json(subscriptions);
  } catch (error) {
    console.error("Error fetching subscriptions:", error);
    res.status(500).json({ error: "Failed to fetch subscriptions" });
  }
};

const updateSubscription = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const subscription = await Subscription.findByPk(id);

    if (!subscription) {
      return res.status(404).json({ error: "Subscription not found" });
    }

    await subscription.update(updateData);

    res
      .status(200)
      .json({ message: "Subscription updated successfully", subscription });
  } catch (error) {
    console.error("Error updating subscription:", error);
    res.status(500).json({ error: "Failed to update subscription" });
  }
};

module.exports = {
  getAllSubscriptions,
  updateSubscription,
};
