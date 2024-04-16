const express = require("express");
const User = require("../../models/User");
const Address = require("../../models/Address");
const jwt = require("jsonwebtoken");
const isAuth = require("../../middleware/isAuth");
const upload = require("../../middleware/multer");
const uploadFile = require("../../utils/fileUpload");
const { sendEmail, genEmailConfirmTemplate } = require("../../utils/sendEmail");
const isVerified = require("../../middleware/isVerified");
const router = express.Router();

router.get("/", isAuth, async (req, res) => {
  const user = req.user;
  return res.status(200).json(user);
});

router.patch("/", isAuth, upload.single("avatar"), async (req, res) => {
  const user = req.user;
  const { username, phone, birthdate } = req.body;
  let avatar;
  try {
    if (req.file) {
      avatar = await uploadFile(`assets/users/${user.id}/avatar`, req.file);
    }
    await User.findByIdAndUpdate(user.id, {
      username,
      phone,
      birthdate,
      avatar,
    });
    return res.sendStatus(204);
  } catch (err) {
    return res.status(400).send(err.message);
  }
});

router.post("/send-verify-email", isAuth, async (req, res) => {
  try {
    const verifyToken = jwt.sign(
      {
        id: req.user.id,
      },
      process.env.VERIFY_TOKEN_SECRET,
      {
        expiresIn: "1d",
      }
    );
    const verifyLink = `${process.env.FE_HOST}/verify?token=${verifyToken}`;
    await sendEmail(
      req.user.email,
      "Please verify your email address",
      genEmailConfirmTemplate(verifyLink)
    );
    return res.send("A verification link has been sent to your email account!");
  } catch (err) {
    return res.status(400).send(err.message);
  }
});

router.post("/verify", async (req, res) => {
  const { token } = req.body;
  if (!token || typeof token !== "string")
    return res.status(400).send("Invalid token!");
  jwt.verify(token, process.env.VERIFY_TOKEN_SECRET, async (err, decoded) => {
    try {
      if (err) throw new Error("Invalid token!");
      const user = await User.findById(decoded.id).exec();
      if (!user) throw new Error("Something went wrong!");
      if (user.verified) throw new Error("Email already verified!");
      user.verified = true;
      await user.save();
      return res.send("Email successfully verified!");
    } catch (err) {
      return res.status(400).send(err.message);
    }
  });
});

router.post("/address", isVerified, async (req, res) => {
  const user = req.user;
  const {
    fullname,
    phone,
    city,
    district,
    ward,
    address,
    alias,
    type,
    is_default,
  } = req.body;
  if (!fullname || typeof fullname !== "string")
    return res.status(400).send("Invalid name!");
  if (!phone || typeof phone !== "string")
    return res.status(400).send("Invalid phone!");
  if (!city || typeof city !== "string")
    return res.status(400).send("Invalid city!");
  if (!district || typeof district !== "string")
    return res.status(400).send("Invalid district!");
  if (!ward || typeof ward !== "string")
    return res.status(400).send("Invalid ward!");
  if (!address || typeof address !== "string")
    return res.status(400).send("Invalid address!");
  if (!alias || typeof alias !== "string")
    return res.status(400).send("Invalid alias!");
  if (!type || typeof type !== "string")
    return res.status(400).send("Invalid type!");
  try {
    const existed = await Address.exists({ ownder: user.id, alias }).exec();
    if (existed) throw new Error("Address already existed!");
    const adr = new Address({
      owner: user.id,
      fullname,
      phone,
      city,
      district,
      ward,
      address,
      alias,
      type,
      is_default: is_default ? true : false,
    });
    await adr.save();
    return res.sendStatus(204);
  } catch (err) {
    return res.status(400).send(err.message);
  }
});

router.get("/address", isVerified, async (req, res) => {
  const user = req.user;
  try {
    if (req.query.default) {
      const addr = await Address.findOne({
        owner: user.id,
        is_default: true,
      }).exec();
      return res.json(addr);
    }
    const addr = await Address.find({ owner: user.id }).exec();
    return res.json(addr);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});
module.exports = router;
