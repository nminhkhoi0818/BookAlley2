const express = require('express');
const Voucher = require('../../models/Voucher');
const isVerified = require('../../middleware/isVerified');
const hasRoles = require('../../middleware/hasRoles');
const router = express.Router();

router.get('/', isVerified, hasRoles("admin"), async (req, res) => {
  try {
    const vouchers = await Voucher.find({ }).exec();
    return res.json(vouchers);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

router.post('/find', isVerified, async (req, res) => {
  const { code } = req.body;
  if (!code || typeof code !== 'string') return res.status(400).send("Invalid code!");
  try {
    const voucher = await Voucher.findOne({ code }).exec();
    if (!voucher) throw new Error("Invalid code!");
    if (voucher.quantity < 1) throw new Error("Invalid code!");
    return res.json(voucher);
  } catch (err) {
    return res.status(400).send(err.message);
  }
});

module.exports = router;
