const express = require("express");
const Review = require("../../models/Review");
const Book = require("../../models/Book");
const isVerified = require("../../middleware/isVerified");
const hasRoles = require("../../middleware/hasRoles");
const upload = require("../../middleware/multer");
const uploadFile = require("../../utils/fileUpload");
const router = express.Router();

router.get("/", hasRoles("admin"), async (req, res) => {
  try {
    const reviews = await Review.find({}).exec();
    return res.json(reviews);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

router.get("/:product_id", async (req, res) => {
  const product_id = req.params.product_id;
  try {
    const product_existed = await Book.exists({ _id: product_id }).exec();
    if (!product_existed) throw new Error("Invalid id!");
    const reviews = await Review.find({ product: product_id })
      .populate("user", "username avatar")
      .exec();
    return res.json(reviews);
  } catch (err) {
    return res.status(400).send(err.message);
  }
});

router.post(
  "/:product_id",
  isVerified,
  upload.array("images", 5),
  async (req, res) => {
    if (req?.fileValidationError)
      return res.status(400).send(req?.fileValidationError.message);
    const product_id = req.params.product_id;
    const user = req.user;
    const { content, rating } = req.body;
    if (!content || typeof content !== "string")
      return res.status(400).send("Missing content!");
    if (!rating || typeof rating !== "string")
      return res.status(400).send("Missing rating!");
    try {
      const product_existed = await Book.exists({ _id: product_id }).exec();
      if (!product_existed) throw new Error("Invalid id!");
      const review = new Review({
        user: user.id,
        product: product_id,
        content: content,
        rating: rating,
      });
      if (req.files) {
        for (let file of req.files) {
          const url = await uploadFile(`assets/users/${user.id}/reviews`, file);
          review.images.push(url);
        }
      }
      await review.save();
      return res.send("Successfully added review!");
    } catch (err) {
      return res.status(400).send(err.message);
    }
  }
);

module.exports = router;
