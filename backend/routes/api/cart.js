const express = require("express");
const Cart = require("../../models/Cart");
const Voucher = require('../../models/Voucher');
const Book = require("../../models/Book");
const isVerified = require("../../middleware/isVerified");
const isAuth = require('../../middleware/isAuth');
const router = express.Router();

router.post("/", isVerified, async (req, res) => {
  const user = req.user;
  const { product_id, quantity } = req.body;
  if (!product_id || typeof product_id !== "string")
    return res.status(400).send("Invalid id!");
  if (!quantity || typeof quantity !== "string")
    return res.status(400).send("Invalid quantity!");
  try {
    const quantityInt = parseInt(quantity);
    if (quantityInt < 1) throw new Error('Invalid quantity!');
    const existed = await Book.exists({ _id: product_id }).exec();
    if (!existed) throw new Error('Product does not exist!');
    let cart = await Cart.findOne({ owner: user.id }).exec();
    if (!cart) {
      cart = new Cart({ owner: user.id });
    }
    const productIndex = cart.items.findIndex((p) => p.product == product_id);
    if (productIndex > -1) {
      cart.items[productIndex].quantity += quantityInt;
    } else {
      cart.items.push({
        product: product_id,
        quantity: quantityInt
      });
    }
    await cart.save();
    return res.send("Item successfully added to cart!");
  } catch (err) {
    return res.status(400).send(err.message);
  }
});

router.delete("/", isVerified, async (req, res) => {
  const user = req.user;
  const { product_id, quantity } = req.body;
  if (!product_id || typeof product_id !== "string")
    return res.status(400).send("Invalid id!");
  if (!quantity || typeof quantity !== "string")
    return res.status(400).send("Invalid quantity!");
  try {
    const quantityInt = parseInt(quantity);
    if (quantityInt < 1) throw new Error('Invalid quantity!');
    const existed = await Book.exists({ _id: product_id }).exec();
    if (!existed) throw new Error('Product does not exist!');
    const cart = await Cart.findOne({ owner: user.id }).exec();
    if (!cart) throw new Error("Cart does not exist!");
    const productIndex = cart.items.findIndex((p) => p.product == product_id);
    if (productIndex > -1) {
      cart.items[productIndex].quantity -= quantityInt;
      if (cart.items[productIndex].quantity < 1) {
        cart.items.splice(productIndex, 1);
      }
    }
    await cart.save();
    return res.send("Item successfully removed from cart!");
  } catch (err) {
    return res.status(400).send(err.message);
  }
});

router.get('/', isAuth, async (req, res) => {
  const user = req.user;
  try {
    const cart = await Cart.findOne({ owner: user.id })
      .populate('items.product', 'name image price')
      .exec();
    return res.json(cart);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

// router.post("/apply-voucher", isVerified, async (req, res) => {
//   const user = req.user;
//   const { code } = req.body;
//   if (!code || typeof code !== 'string') return res.status(400).send("Invalid code!");
//   try {
//     const voucher = await Voucher.findOne({ code }).exec();
//     if (!voucher) throw new Error("Invalid code!");
//     if (voucher.quantity < 1) throw new Error("Invalid code!");
//     const applied = await Cart.exists({ owner: user.id, voucher: { $ne: null }}).exec();
//     if (applied) throw new Error("Already applied voucher, please remove it first!");
//     await Voucher.findByIdAndUpdate(voucher.id, {$inc: { quantity: -1 }}).exec();
//     await Cart.findOneAndUpdate({owner: user.id}, {voucher: voucher.id}).exec();
//     return res.sendStatus(204);
//   } catch (err) {
//     return res.status(400).send(err.message);
//   }
// })

// router.post("/remove-voucher", isVerified, async (req, res) => {
//   const user = req.user;
//   try {
//     const cart = await Cart.findOne({ owner: user.id }).select("voucher").exec();
//     if (!cart.voucher) throw new Error('No voucher applied!');
//     await Voucher.findByIdAndUpdate(cart.voucher, { $inc: { quantity: 1 }}).exec();
//     await Cart.findOneAndUpdate({ owner: user.id }, { $unset: { voucher: 1 }}).exec();
//     return res.sendStatus(204);
//   } catch (err) {
//     return res.status(400).send(err.message);
//   }
// })

module.exports = router;