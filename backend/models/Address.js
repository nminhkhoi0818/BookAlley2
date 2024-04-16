const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    fullname: {
      type: String,
      trim: true
    },
    phone: {
      type: String,
      validate: [
        {
          validator: (p) =>
            /(\+?( |-|\.)?\d{1,2}( |-|\.)?)?(\(?\d{3}\)?|\d{3})( |-|\.)?(\d{3}( |-|\.)?\d{4})/.test(
              p
            ),
          msg: 'Invalid phone number'
        }
      ]
    },
    alias: {
      type: String,
      default: 'Home',
      trim: true
    },
    city: {
      type: String,
      trim: true
    },
    district: {
      type: String,
      trim: true
    },
    ward: {
      type: String,
      trim: true
    },
    address: {
      type: String,
      trim: true
    },
    type: {
      type: String,
      enum: ['Home/Apartment', 'Company'],
      default: 'Home/Apartment'
    },
    is_default: {
      type: Boolean,
      default: false
    }
  },
  {
    collection: 'addresses',
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

module.exports = mongoose.model('Address', addressSchema);
