const express = require("express");
const User = require("../../models/User");
const Address = require("../../models/Address");
const jwt = require("jsonwebtoken");
const isAuth = require("../../middleware/isAuth");
const upload = require("../../middleware/multer");
const uploadFile = require("../../utils/fileUpload");
const { sendEmail, genEmailConfirmTemplate } = require("../../utils/sendEmail");
const isVerified = require("../../middleware/isVerified");
const hasRoles = require('../../middleware/hasRoles');
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
    const existed = await Address.exists({ owner: user.id, alias }).exec();
    if (existed) {
      await Address.findByIdAndUpdate(existed._id, {
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
    } else {
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
    }
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

router.get('/list', isVerified, hasRoles('admin'), async (req, res) => {
  const user = req.user;
  try {
    const page = req.query.page || 1;
    const limit = parseInt(req.query.items) || 10;
    const skip = page * limit - limit;

    const resultsPromise = User.find()
      .skip(skip)
      .limit(limit)
      .sort({ created_at: 'desc', _id: 1 })
      .select('-password -refresh_token');
    // Counting the total documents
    const countPromise = User.count();
    // Resolving both promises
    const [result, count] = await Promise.all([resultsPromise, countPromise]);
    // Calculating total pages
    const pages = Math.ceil(count / limit);

    // Getting Pagination Object
    const pagination = { page, pages, count };
    if (count > 0) {
      return res.status(200).json({
        success: true,
        result,
        pagination,
        message: 'Successfully found all documents'
      });
    } else {
      return res.status(203).json({
        success: false,
        result: [],
        pagination,
        message: 'Collection is Empty'
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      result: [],
      message: 'Oops there is an Error'
    });
  }
});

router.get('/search', async (req, res) => {
  if (req.query.q === undefined || req.query.q === '' || req.query.q === ' ') {
    return res
      .status(202)
      .json({
        success: true,
        result: [],
        message: 'No document found by this request'
      })
      .end();
  }
  const fieldsArray = req.query.fields.split(',');

  const fields = { $or: [] };

  for (const field of fieldsArray) {
    fields.$or.push({ [field]: { $regex: new RegExp(req.query.q, 'i') } });
  }

  try {
    let results = await User.find(fields).sort({ name: 'asc' }).limit(10);

    if (results.length >= 1) {
      return res.status(200).json({
        success: true,
        result: results,
        message: 'Successfully found all documents'
      });
    } else {
      return res
        .status(202)
        .json({
          success: true,
          result: [],
          message: 'No document found by this request'
        })
        .end();
    }
  } catch {
    return res.status(500).json({
      success: false,
      result: null,
      message: 'Oops there is an Error'
    });
  }
});

router.patch(
  '/update/:id',
  isVerified,
  hasRoles('admin'),
  async (req, res) => {
    try {
      const dbuser = await User.findById(req.params.id).exec();
      if (dbuser.role === 'admin') {
        return res.status(400).json({
          success: false,
          result: null,
          message: "Can't change role of admin"
        });
        
      } 
      const result = await User.findOneAndUpdate(
        { _id: req.params.id },
        req.body,
        {
          new: true, // return the new result instead of the old one
          runValidators: true
        }
      )
        .select('-password -refresh_token')
        .exec();
      // Find document by id and updates with the required fields
    
      return res.status(200).json({
        success: true,
        result,
        message: 'we update this document by this id: ' + req.params.id
      });
    } catch (err) {
      // If err is thrown by Mongoose due to required validations
      if (err.name == 'ValidationError') {
        return res.status(400).json({
          success: false,
          result: null,
          message: 'Required fields are not supplied'
        });
      } else {
        // Server Error
        return res.status(500).json({
          success: false,
          result: null,
          message: 'Oops there is an Error'
        });
      }
    }
  }
);
router.delete(
  '/delete/:id',
  isVerified,
  hasRoles('admin'),
  async (req, res) => {
    try {
      // Find the document by id and delete it

      // Find the document by id and delete it
      const result = await User.findOneAndDelete({ _id: req.params.id }).exec();
      // If no results found, return document not found
      if (!result) {
        return res.status(404).json({
          success: false,
          result: null,
          message: 'No document found by this id: ' + req.params.id
        });
      } else {
        return res.status(200).json({
          success: true,
          result,
          message: 'Successfully Deleted the document by id: ' + req.params.id
        });
      }
    } catch {
      return res.status(500).json({
        success: false,
        result: null,
        message: 'Oops there is an Error'
      });
    }
  }
);
module.exports = router;
