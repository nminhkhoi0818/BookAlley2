const express = require("express");
const Voucher = require("../../models/Voucher");
const Book = require("../../models/Book");
const Address = require("../../models/Address");
const Order = require("../../models/Order");
const Cart = require("../../models/Cart");
const isVerified = require("../../middleware/isVerified");
const hasRoles = require("../../middleware/hasRoles");
const Shop = require("../../models/Shop");
const router = express.Router();

router.post("/", isVerified, async (req, res) => {
  const user = req.user;
  const fromCart = req.query.fromCart ? true : false;
  const { voucher, items, shipping_info, shipping_method, payment_method } =
    req.body;
  if (!shipping_info || typeof shipping_info !== "string")
    return res.status(400).send("Invalid address ID!");
  if (!shipping_method || typeof shipping_method !== "string")
    return res.status(400).send("Invalid shipping method!");
  if (!payment_method || typeof payment_method !== "string")
    return res.status(400).send("Invalid payment method!");
  if (!items || !Array.isArray(items))
    return res.status(400).send("Invalid items!");
  try {
    if (!(await Address.exists({ _id: shipping_info })))
      throw new Error("Invalid address ID!");
    let cart;
    if (fromCart) {
      cart = await Cart.findOne({ owner: user.id }).exec();
      if (!cart) throw new Error("Cart does not exist!");
    }
    const orders = {};

    for (const item of items) {
      if (
        !item.product ||
        typeof item.product !== "string" ||
        !item.quantity ||
        typeof item.quantity !== "number" ||
        item.quantity < 1
      )
        throw new Error("Invalid products!");
      const product = await Book.findById(item.product)
        .select("seller price instock")
        .exec();
      if (!product) throw new Error("Invalid products!");

      if (!(product.seller in orders)) {
        orders[product.seller] = new Order({
          owner: user.id,
          seller: product.seller,
          shipping_info,
          shipping_method,
          payment_method,
        });
      }

      item.quantity = parseInt(item.quantity);

      if (item.quantity > product.instock)
        throw new Error("Not enough book in stock!");

      orders[product.seller].items.push({
        product: product._id,
        quantity: item.quantity,
      });

      orders[product.seller].sub_total += product.price * item.quantity;

      await Book.findByIdAndUpdate(item.product, {
        $inc: { instock: -item.quantity },
      }).exec();

      if (fromCart) {
        const productIndex = cart.items.findIndex(
          (p) => p.product == product.id
        );
        if (productIndex > -1) {
          cart.items.splice(productIndex, 1);
        }
      }
    }
    if (fromCart) {
      await cart.save();
    }
    // let sub_total = 0, total;
    // for(const item of items) {
    //   if (!item.product || typeof item.product !== 'string' || !item.quantity || typeof item.quantity !== 'number' || item.quantity < 1) throw new Error('Invalid products!');
    //   const product = await Book.findById(item.product).select("price").exec();
    //   if (!product) throw new Error('Invalid products!');
    //   item.quantity = parseInt(item.quantity);
    //   sub_total += product.price * item.quantity;
    // }

    let discount = 0;
    if (voucher) {
      if (typeof voucher !== "string") throw new Error("Invalid voucher");
      const voucherItem = await Voucher.findById(voucher)
        .select("quantity")
        .exec();
      if (!voucherItem) throw new Error("Invalid voucher!");
      if (voucherItem.quantity < 1) throw new Error("Invalid voucher!");
      discount = voucherItem.discount;
      await Voucher.findByIdAndUpdate(voucher, {
        $inc: { quantity: -1 },
      }).exec();
    }
    for (const id in orders) {
      orders[id].voucher = voucher;
      orders[id].total = orders[id].sub_total * (1 - discount);
      await orders[id].save();
    }
    return res.sendStatus(204);
  } catch (err) {
    return res.status(400).send(err.message);
  }
});

router.get("/", isVerified, hasRoles("admin"), async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("items.product shipping_info voucher")
      .exec();
    return res.json(orders);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

router.get("/user", isVerified, async (req, res) => {
  const user = req.user;
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const orders = await Order.paginate(
      { owner: user.id },
      {
        page,
        limit,
        populate: [
          { path: "items.product", select: "name price image seller" },
          "shipping_info",
        ],
      }
    );
    return res.json(orders);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

router.get(
  "/shop",
  isVerified,
  hasRoles("seller", "admin"),
  async (req, res) => {
    const user = req.user;
    try {
      const shop = await Shop.findOne({ owner: user.id }).exec();
      if (!shop) throw new Error("No shop associated with seller!");
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const orders = await Order.paginate(
        { seller: shop.id },
        {
          page,
          limit,
          populate: [
            { path: "items.product", select: "name price image seller rating" },
            "shipping_info",
          ],
        }
      );
      // const orders = await Order.find({})
      //   .populate([
      //     {
      //       path: 'items.product',
      //       select: 'name price image seller',
      //       match: { seller: { $eq: shop.id } }
      //     },
      //     'shipping_info'
      //   ])
      //   .exec();

      // const result = orders.filter((order) => {
      //   order.items = order.items.filter((item) => {
      //     return item.product;
      //   })
      //   return order.items.length;
      // });
      return res.json(orders);
    } catch (err) {
      return res.status(500).send(err.message);
    }
  }
);

router.get("/detail/:order_id", isVerified, async (req, res) => {
  const user = req.user;
  try {
    const shop = await Shop.findOne({ owner: user.id }).exec();
    const order_id = req.params.order_id;
    const order = await Order.findOne({
      _id: order_id,
      $or: [{ owner: user.id }, { seller: shop?.id }],
    })
      .populate([
        { path: "owner", select: "-password -refresh_token" },
        { path: "seller", select: "-listings" },
        { path: "items.product", select: "name price image" },
        { path: "voucher", select: "name description discount" },
        "shipping_info ",
      ])
      .exec();
    return res.json(order);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

router.patch(
  "/:order_id",
  isVerified,
  hasRoles("seller", "admin"),
  async (req, res) => {
    const user = req.user;
    try {
      const shop = await Shop.findOne({ owner: user.id }).exec();
      const order_id = req.params.order_id;
      const order = await Order.findOne({
        _id: order_id,
        seller: shop.id,
      }).exec();

      if (req.body.status && typeof req.body.status === "string") {
        const new_status = req.body.status;

        if (order.status === "completed" || order.status === "canceled")
          throw new Error("Failed to update order!");
        if (order.status === "delivering") {
          if (new_status !== "completed")
            throw new Error("Failed to update order!");
          order.status = new_status;
          for (const item of order.items) {
            await Book.findByIdAndUpdate(item.product, {
              $inc: { sold: item.quantity },
            });
          }
        } else if (order.status === "pending") {
          if (new_status !== "delivering" && new_status !== "canceled")
            throw new Error("Failed to update order!");
          order.status = new_status;

          if (new_status === "canceled") {
            for (const item of order.items) {
              await Book.findByIdAndUpdate(item.product, {
                $inc: { instock: item.quantity },
              });
            }
          }
        }
      }
      await order.save();
      return res.sendStatus(204);
    } catch (err) {
      return res.status(500).send(err.message);
    }
  }
);

module.exports = router;
