const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book'
    },
    content: {
      type: String
    },
    images: [
      {
        type: String
      }
    ],
    rating: {
      type: Number,
      min: 0,
      max: 5
    },
    likes: {
      type: Number,
      min: 0,
      default: 0
    }
  },
  {
    collection: 'reviews',
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

module.exports = mongoose.model('Review', reviewSchema);
