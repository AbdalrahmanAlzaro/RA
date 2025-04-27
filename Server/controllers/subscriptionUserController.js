const { UserSubscription, Subscription, User } = require("../models");
const nodemailer = require("nodemailer");
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

const getBusinessByToken = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ message: "Authorization token is required" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const business = await UserSubscription.findOne({
      where: { userId },
    });

    if (!business) {
      return res
        .status(404)
        .json({ message: "Business not found for this user" });
    }

    return res.status(200).json(business);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const updateBusinessDetails = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ message: "Authorization token is required" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const business = await UserSubscription.findOne({
      where: { userId },
    });

    if (!business) {
      return res
        .status(404)
        .json({ message: "Business not found for this user" });
    }

    const {
      businessName,
      businessEmail,
      businessPhone,
      businessDescription,
      businessWebsiteUrl,
    } = req.body;

    if (businessName !== undefined) business.businessName = businessName;
    if (businessEmail !== undefined) business.businessEmail = businessEmail;
    if (businessPhone !== undefined) business.businessPhone = businessPhone;
    if (businessDescription !== undefined)
      business.businessDescription = businessDescription;
    if (businessWebsiteUrl !== undefined)
      business.businessWebsiteUrl = businessWebsiteUrl;

    if (req.file) {
      business.mainImage = `/uploads/${req.file.filename}`;
    }

    await business.save();

    return res
      .status(200)
      .json({ message: "Business details updated successfully", business });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getAllBusinesses = async (req, res) => {
  try {
    const businesses = await UserSubscription.findAll();

    return res.status(200).json(businesses);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const updateBusinessStatus = async (req, res) => {
  try {
    const { businessId, status } = req.body;

    if (!businessId) {
      return res.status(400).json({ message: "Business ID is required" });
    }

    if (!["pending", "approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const business = await UserSubscription.findOne({
      where: { id: businessId },
    });

    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }

    business.status = status;
    await business.save();

    const user = await User.findOne({
      where: { id: business.userId },
    });

    if (user) {
      user.role = "business";
      await user.save();
    }

    await sendStatusUpdateEmail(business.businessEmail, status);

    return res.status(200).json({
      message: `Business status updated to ${status}, user role updated to 'business'`,
      business,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const sendStatusUpdateEmail = async (userEmail, status) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const subject = `Your Business Subscription Status: ${status}`;
    let text;
    if (status === "approved") {
      text = "Congratulations! Your business subscription has been approved.";
    } else if (status === "rejected") {
      text = "We're sorry, but your business subscription has been rejected.";
    } else {
      text =
        "Your business subscription is still pending. We will notify you once it's approved.";
    }

    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: userEmail,
      subject: subject,
      text: text,
    });

    console.log("Email sent: " + info.response);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports = {
  createSubscription,
  getBusinessByToken,
  updateBusinessDetails,
  getAllBusinesses,
  updateBusinessStatus,
};
