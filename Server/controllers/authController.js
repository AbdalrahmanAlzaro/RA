const { User } = require("../models");
const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.JWT_SECRET;
const nodemailer = require("nodemailer");
const { Op } = require("sequelize");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;

// Passport Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:4000/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ where: { googleId: profile.id } });

        if (!user) {
          user = await User.create({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
          });
        }

        done(null, user);
      } catch (error) {
        done(error, null);
      }
    }
  )
);

// Passport Facebook Strategy
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: "http://localhost:4000/auth/facebook/callback",
      profileFields: ["id", "displayName", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ where: { facebookId: profile.id } });

        if (!user) {
          user = await User.create({
            facebookId: profile.id,
            name: profile.displayName,
            email: profile.emails?.[0]?.value || `${profile.id}@facebook.com`,
          });
        }

        done(null, user);
      } catch (error) {
        done(error, null);
      }
    }
  )
);

// Passport Serialize User
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Passport Deserialize User
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

const authController = {
  async signUp(req, res) {
    try {
      const { name, email, password } = req.body;
      const trimmedEmail = email.trim();
      const trimmedPassword = password.trim();

      const existingUser = await User.findOne({
        where: { email: trimmedEmail },
      });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      const newUser = await User.create({
        name,
        email: trimmedEmail,
        password: trimmedPassword,
      });

      const token = jwt.sign({ id: newUser.id }, SECRET_KEY, {
        expiresIn: "1w",
      });

      res.status(201).json({ token });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error signing up", error: error.message });
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const trimmedEmail = email.trim();
      const trimmedPassword = password.trim();

      const user = await User.findOne({ where: { email: trimmedEmail } });
      if (!user) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      const isPasswordValid = await user.comparePassword(trimmedPassword);
      if (!isPasswordValid) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign({ id: user.id }, SECRET_KEY, {
        expiresIn: "1w",
      });

      res.status(200).json({ token });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error logging in", error: error.message });
    }
  },

  async forgotPassword(req, res) {
    try {
      const { email } = req.body;
      const trimmedEmail = email.trim();

      const user = await User.findOne({ where: { email: trimmedEmail } });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const resetToken = jwt.sign({ id: user.id }, SECRET_KEY, {
        expiresIn: "1h",
      });

      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires = Date.now() + 3600000;
      await user.save();

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const mailOptions = {
        to: user.email,
        from: process.env.EMAIL_USER,
        subject: "Password Reset",
        text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
          Please click on the following link, or paste this into your browser to complete the process:\n\n
          http://localhost:5173/reset-password/${resetToken}\n\n
          If you did not request this, please ignore this email and your password will remain unchanged.\n`,
      };

      await transporter.sendMail(mailOptions);

      res.status(200).json({ message: "Password reset email sent" });
    } catch (error) {
      res.status(500).json({
        message: "Error sending password reset email",
        error: error.message,
      });
    }
  },

  async resetPassword(req, res) {
    try {
      const { token, newPassword } = req.body;

      const decoded = jwt.verify(token, SECRET_KEY);
      const user = await User.findOne({
        where: {
          id: decoded.id,
          resetPasswordToken: token,
          resetPasswordExpires: { [Op.gt]: Date.now() },
        },
      });

      if (!user) {
        return res.status(400).json({ message: "Invalid or expired token" });
      }

      user.password = newPassword.trim();
      user.resetPasswordToken = null;
      user.resetPasswordExpires = null;
      await user.save();

      res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error resetting password", error: error.message });
    }
  },

  googleAuth: passport.authenticate("google", {
    scope: ["profile", "email"],
  }),

  googleAuthCallback: [
    passport.authenticate("google", { failureRedirect: "/login" }),
    (req, res) => {
      try {
        // Generate a JWT token
        const token = jwt.sign({ id: req.user.id }, SECRET_KEY, {
          expiresIn: "1w",
        });

        // Redirect to the frontend with the token
        res.redirect(`http://localhost:5173?token=${token}`);
      } catch (error) {
        console.error("Error generating token:", error);
        res.status(500).json({ message: "Error generating token", error });
      }
    },
  ],

  facebookAuth: passport.authenticate("facebook", {
    scope: ["email"],
  }),

  facebookAuthCallback: [
    passport.authenticate("facebook", { failureRedirect: "/login" }),
    (req, res) => {
      try {
        // Generate a JWT token
        const token = jwt.sign({ id: req.user.id }, SECRET_KEY, {
          expiresIn: "1w",
        });

        // Redirect to the frontend with the token
        res.redirect(`http://localhost:5173?token=${token}`);
      } catch (error) {
        console.error("Error generating token:", error);
        res.status(500).json({ message: "Error generating token", error });
      }
    },
  ],
};

module.exports = authController;
