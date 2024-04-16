const mongoose = require('mongoose');

const voucherSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true
    },
    code: {
      type: String,
      unique: true,
      trim: true
    },
    quantity: {
      type: Number,
      min: 0
    },
    description: {
      type: String,
      trim: true
    },
    discount: {
      type: Number,
      min: 0,
      max: 1
    }
  },
  {
    collection: 'vouchers',
    virtuals: {
      id: {
        get() {
          return this._id;
        }
      }
    },
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  }
);

module.exports = mongoose.model('Voucher', voucherSchema);
