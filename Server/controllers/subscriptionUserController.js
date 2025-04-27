const { UserSubscription, Subscription, User } = require("../models");
const jwt = require("jsonwebtoken");
const moment = require("moment");

const createSubscription = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ message: "Authorization token is required" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const {
      subscriptionId,
      billingCycle,
      businessName,
      businessEmail,
      businessPhone,
      businessDescription,
      businessWebsiteUrl,
    } = req.body;

    const subscription = await Subscription.findByPk(subscriptionId);
    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    const startDate = moment().toDate();

    let endDate;
    if (billingCycle === "weekly") {
      endDate = moment(startDate).add(1, "week").toDate();
    } else if (billingCycle === "monthly") {
      endDate = moment(startDate).add(1, "month").toDate();
    } else if (billingCycle === "yearly") {
      endDate = moment(startDate).add(1, "year").toDate();
    } else {
      return res.status(400).json({ message: "Invalid billing cycle" });
    }

    const mainImage = req.file ? `/uploads/${req.file.filename}` : null;

    const newSubscription = await UserSubscription.create({
      userId: userId,
      subscriptionId: subscriptionId,
      billingCycle,
      startDate,
      endDate,
      businessName,
      businessEmail,
      businessPhone,
      businessDescription,
      businessWebsiteUrl,
      status: "pending",
      mainImage,
    });

    return res.status(201).json(newSubscription);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { createSubscription };
