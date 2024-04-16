const express = require("express");
const User = require("../../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  sendEmail,
  genPasswordResetTemplate,
  genEmailConfirmTemplate,
} = require("../../utils/sendEmail");
const router = express.Router();

router.post("/register", async (req, res) => {
  const { username, password, email } = req.body;
  try {
    if (
      !username ||
      !password ||
      !email ||
      typeof username !== "string" ||
      typeof password !== "string" ||
      typeof email !== "string"
    )
      throw new Error("Invalid username, email or password!");
    const exists = await User.exists({ email });
    if (exists) throw new Error("Email already in used");
    if (password.length < 8) throw new Error("Password too short");
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    const user = await newUser.save();
    if (!user) throw new Error("Something went wrong!");
    console.log(user.id);
    const verifyToken = jwt.sign(
      {
        id: user.id,
      },
      process.env.VERIFY_TOKEN_SECRET,
      {
        expiresIn: "1d",
      }
    );
    console.log(verifyToken);
    const verifyLink = `${process.env.FE_HOST}/verify?token=${verifyToken}`;
    await sendEmail(
      email,
      "Please verify your email address",
      genEmailConfirmTemplate(verifyLink)
    );
    return res.send(
      "User registered! A verification link has been sent to your email account!"
    );
  } catch (err) {
    return res.status(400).send(err.message);
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    if (
      !password ||
      !email ||
      typeof password !== "string" ||
      typeof email !== "string"
    )
      throw new Error("Invalid email or password!");

    const user = await User.findOne({ email }).exec();

    if (!user) throw new Error("Email or password is incorrect!");

    const matched = await bcrypt.compare(password, user.password);

    if (!matched) throw new Error("Email or password is incorrect!");

    const accessToken = jwt.sign(
      {
        id: user.id,
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "3000s",
      }
    );
    const refreshToken = jwt.sign(
      {
        id: user.id,
      },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "2d",
      }
    );
    user.refresh_token = refreshToken;
    await user.save();

    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 2 * 24 * 60 * 60 * 1000,
    });
    res.json({ access_token: accessToken });
  } catch (err) {
    return res.status(401).send(err.message);
  }
});

router.post("/logout", async (req, res) => {
  const cookies = req.cookies;
  const refreshToken = cookies?.refresh_token;
  if (!refreshToken) return res.sendStatus(204);
  const user = await User.findOne({ refresh_token: refreshToken }).exec();

  if (user) {
    user.refresh_token = null;
    await user.save();
  }
  res.clearCookie("refresh_token", {
    httpOnly: true,
    sameSite: "None",
    secure: true,
  });
  return res.sendStatus(204);
});

// Use refresh token to generate new access token if it expires
router.post("/refresh", async (req, res) => {
  const cookies = req.cookies;
  const refreshToken = cookies?.refresh_token;
  if (!refreshToken) return res.sendStatus(403);

  const user = await User.findOne({ refresh_token: refreshToken }).exec();
  if (!user) return res.sendStatus(403);

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
      if (err || decoded.id !== user.id) return sendStatus(403);

      const accessToken = jwt.sign(
        {
          id: user.id,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
          expiresIn: "3000s",
        }
      );

      return res.json({ access_token: accessToken });
    }
  );
});

router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  try {
    if (!email || typeof email !== "string") throw new Error("Invalid email!");
    const user = await User.findOne({ email }).exec();
    if (!user) throw new Error("Email is not registered!");
    const resetToken = jwt.sign(
      {
        id: user.id,
      },
      user.password, // Use salted and hashed password as key
      {
        expiresIn: "900s",
      }
    );
    const resetLink = `${process.env.FE_HOST}/reset-password?id=${user.id}&token=${resetToken}`;
    await sendEmail(
      user.email,
      "Password Reset Requested From BookAlley",
      genPasswordResetTemplate(resetLink)
    );
    return res.send("Password reset link sent to your email account!");
  } catch (err) {
    return res.status(400).send(err.message);
  }
});

router.post("/reset-password", async (req, res) => {
  const { id, token, new_password } = req.body;
  try {
    if (!id || !token || typeof id !== "string" || typeof token !== "string")
      throw new Error("Invalid id or token!");
    if (!new_password || typeof new_password !== "string")
      throw new Error("Invalid password!");
    const user = await User.findById(id).exec();
    jwt.verify(token, user.password, async (err, decoded) => {
      try {
        if (err || decoded.id !== user.id) throw new Error("Invalid token!");
        if (new_password.length < 8) throw new Error("Password too short!");
        const hashedPassword = await bcrypt.hash(new_password, 10);
        user.password = hashedPassword;
        await user.save();
        return res.send("Password successfully updated!");
      } catch (err) {
        return res.status(400).send(err.message);
      }
    });
  } catch (err) {
    return res.status(400).send(err.message);
  }
});

module.exports = router;
