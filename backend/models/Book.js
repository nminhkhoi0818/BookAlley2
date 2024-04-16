const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const bookSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    translator: {
      type: String,
    },
    publisher: {
      type: String,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
    },
    year_published: {
      type: Number,
      min: 0,
    },
    weight: {
      type: Number,
      min: 0,
      default: 0,
    },
    size: {
      type: String,
    },
    pages: {
      type: Number,
      min: 0,
    },
    binding_method: {
      type: String,
    },
    price: {
      type: Number,
      min: 1,
      required: true,
    },
    image: {
      type: String,
      default:
        "https://firebasestorage.googleapis.com/v0/b/bookalley-b6495.appspot.com/o/assets%2Fdefault%2Fno-image.png?alt=media&token=72bf0771-8a7a-4c54-87cc-614088a80769",
    },
    description: {
      type: String,
      require: true,
    },
    tags: [
      {
        type: String,
        enum: {
          values: [
            "science",
            "action",
            "cookbooks",
            "horror",
            "romance",
            "literature",
            "economics",
            "psychology",
            "manga",
            "comic",
            "novel",
            "history",
            "geography",
            "religion",
          ],
          message: "{VALUE} is not a valid tag",
        },
      },
    ],
    instock: {
      type: Number,
      default: 0,
    },
    sold: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    language: {
      type: String,
    },
  },
  {
    collection: "books",
    virtuals: {
      id: {
        get() {
          return this._id;
        },
      },
    },
    statics: {
      getTagList() {
        return this.schema.path("tags.0").enumValues;
      },
    },
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

bookSchema.index({ name: 1, author: 1 }, { unique: true });

bookSchema.index(
  {
    name: 'text',
    author: 'text',
    publisher: 'text',
    translator: 'text',
    tags: 'text'
  },
  { default_language: 'none', language_override: 'none' }
);

// const PaginatePlugin = (schema, options) => {
//   options = options || {};
//   schema.query.paginate = async function (params) {
//     const pagination = {
//       limit: options.limit || 10,
//       page: 1,
//       count: 0
//     };
//     pagination.limit = parseInt(params.limit) || pagination.limit;
//     const page = parseInt(params.page);
//     pagination.page = page > 0 ? page : pagination.page;
//     const offset = (pagination.page - 1) * pagination.limit;

//     const [data, count] = await Promise.all([
//       this.limit(pagination.limit).skip(offset),
//       this.model.countDocuments(this.getQuery())
//     ]);
//     pagination.count = count;
//     return { data, pagination };
//   };
// };

bookSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Book", bookSchema);
