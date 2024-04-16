const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const orderSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Shop'
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Book'
        },
        quantity: {
          type: Number,
          default: 1,
          min: [1, 'Quantity can not be less then 1!']
        }
      }
    ],
    shipping_info: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Address'
    },
    voucher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Voucher'
    },
    shipping_method: {
      type: String,
      trim: true
    },
    payment_method: {
      type: String,
      trim: true
    },
    sub_total: {
      type: Number,
      min: 0,
      default: 0
    },
    total: {
      type: Number,
      min: 0,
      default: 0
    },
    status: {
      type: String,
      enum: ['pending', 'delivering', 'completed', 'canceled'],
      default: 'pending'
    }
  },
  {
    collection: 'orders',
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

orderSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Order', orderSchema);
