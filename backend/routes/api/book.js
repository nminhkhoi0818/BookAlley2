const express = require("express");
const Book = require("../../models/Book");
const Shop = require("../../models/Shop");
const uploadFile = require("../../utils/fileUpload");
const upload = require("../../middleware/multer");
const isVerified = require("../../middleware/isVerified");
const hasRoles = require("../../middleware/hasRoles");
const router = express.Router();

router.get("/", async (req, res) => {
  return res.sendStatus(204);
});

router.post(
  "/",
  isVerified,
  hasRoles("seller", "admin"),
  upload.single("image"),
  async (req, res) => {
    if (req?.fileValidationError)
      return res.status(400).send(req?.fileValidationError.message);
    try {
      const user = req.user;
      const {
        name,
        author,
        description,
        price,
        translator,
        publisher,
        year_published,
        weight,
        size,
        pages,
        binding_method,
        instock,
        language,
        tags,
      } = req.body;
      if (!name || typeof name !== "string") throw new Error("Invalid name!");
      if (!author || typeof author !== "string")
        throw new Error("Invalid author!");
      if (!description || typeof description !== "string")
        throw new Error("Invalid description!");
      if (!price || isNaN(price) || price <= 0)
        throw new Error("Invalid price!");
      const shop = await Shop.exists({ owner: user.id }).exec();
      if (!shop) throw new Error("No shop associated with seller!");
      const data = { name, author, description, price, seller: shop._id };
      if (translator && typeof translator === "string") {
        data.translator = translator;
      }
      if (publisher && typeof publisher === "string") {
        data.publisher = publisher;
      }
      if (year_published && !isNaN(year_published)) {
        data.year_published = year_published;
      }
      if (weight && typeof !isNaN(weight)) {
        data.weight = weight;
      }
      if (size && typeof size === "string") {
        data.size = size;
      }
      if (pages && !isNaN(pages)) {
        data.pages = pages;
      }
      if (binding_method && typeof binding_method === "string") {
        data.binding_method = binding_method;
      }
      if (instock && !isNaN(instock)) {
        data.instock = instock;
      }
      if (language && typeof language === "string") {
        data.language = language;
      }
      if (tags && Array.isArray(tags)) {
        data.tags = tags;
      }
      const book = new Book(data);
      await book.validate();

      if (req.file) {
        const imageURL = await uploadFile("assets/products", req.file);
        book.image = imageURL;
      }
      await book.save();
      await Shop.findByIdAndUpdate(shop._id, {
        $push: { listings: book._id },
      }).exec();
      return res.send("Product created!");
    } catch (err) {
      return res.status(400).send(err.message);
    }
  }
);

router.patch("/:id", isVerified, hasRoles("seller"), async (req, res) => {
  const id = req.params.id;
  try {
    const { image, ...filtered } = req.body;
    await Book.findByIdAndUpdate(id, filtered, { runValidators: true });
    return res.sendStatus(204);
  } catch (err) {
    return res.status(400).send(err.message);
  }
});

router.patch('/update/:id', isVerified, hasRoles('admin'), async (req, res) => {
  try {
    // Find document by id and updates with the required fields
    const result = await Book.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      {
        new: true, // return the new result instead of the old one
        runValidators: true
      }
    ).exec();

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
});

router.delete('/:id', isVerified, hasRoles('seller'), async (req, res) => {
  try {
    const id = req.params.id;
    const user = req.user;
    const shop = await Shop.exists({ owner: user.id }).exec();
    if (!shop) throw new Error("No shop associated with seller!");
    await Book.findOneAndDelete({ _id: id, seller: shop._id });
    return res.sendStatus(204);
  } catch (err) {
    return res.status(400).send(err.message);
  }
});

router.delete('/delete/:id', isVerified, hasRoles('admin'), async (req, res) => {
  try {
    // Find the document by id and delete it

    // Find the document by id and delete it
    const result = await Book.findOneAndDelete({ _id: req.params.id }).exec();
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
});
router.get("/tags", async (req, res) => {
  try {
    const availableTags = {
      tags: Book.getTagList(),
    };
    return res.json(availableTags);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

router.get("/list-books", async (req, res) => {
  try {
    // const amount = parseInt(req.query.amount);
    // let list;
    // if (!amount) {
    //   list = await Book.find({}, 'name image rating price').exec();
    // } else {
    //   list = await Book.aggregate([
    //     {
    //       $project: {
    //         name: 1,
    //         image: 1,
    //         rating: 1,
    //         price: 1,
    //       }
    //     }
    //   ]).sample(amount);
    // }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const list = await Book.paginate(
      {},
      { select: "name image rating price", page, limit }
    );
    return res.send(list);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

router.get("/get-detail/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const book = await Book.findById(id).populate("seller", "name logo").exec();
    if (!book) throw new Error("Book doesn't exist!");
    return res.json(book);
  } catch (err) {
    return res.status(400).send(err.message);
  }
});

router.get("/search-book", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const searchTerm = req.query.searchTerm;
    const list = await Book.paginate(
      {
        $text: {
          $search: `\"${searchTerm}\"`,
        },
      },
      { select: "name image rating price", page, limit }
    );
    return res.send(list);
  } catch (err) {
    return res.status(500).send(err.message);
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
    let results = await Book.find(fields).sort({ name: 'asc' }).limit(10);

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

router.get('/list', isVerified, hasRoles('admin'), async (req, res) => {
  const page = req.query.page || 1;
  const limit = parseInt(req.query.items) || 10;
  const skip = page * limit - limit;
  try {
    //  Query the database for a list of all results
    const resultsPromise = Book.find()
      .skip(skip)
      .limit(limit)
      .sort({ created_at: 'desc', _id: 1 });
      // .populate();
    // Counting the total documents
    const countPromise = Book.count();
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
        message: "Successfully found all documents",
      });
    } else {
      return res.status(203).json({
        success: false,
        result: [],
        pagination,
        message: "Collection is Empty",
      });
    }
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, result: [], message: "Oops there is an Error" });
  }
});
module.exports = router;
