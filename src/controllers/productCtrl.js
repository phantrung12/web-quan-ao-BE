const Product = require("../models/Product");
const Category = require("../models/Category");
const shortid = require("shortid");
const { default: slugify } = require("slugify");
const ApiFeatures = require("../utils/apiFeatures");

exports.createProduct = (req, res) => {
  // res.status(200).json({ file: req.files, body: req.body });

  const {
    name,
    price,
    quantity,
    description,
    category,
    productPictures,
    color,
    size,
    createdBy,
  } = req.body;

  const product = new Product({
    name: name,
    slug: slugify(name),
    price,
    quantity,
    description,
    productPictures,
    category,
    color,
    size,
    createdBy: req.user._id,
  });

  product.save((error, product) => {
    if (error) return res.status(400).json({ error });
    if (product) {
      res.status(200).json({ product, files: req.files });
    }
  });
};

exports.getProductsBySlug = (req, res) => {
  const { slug } = req.params;
  Category.findOne({ slug: slug })
    .select("_id")
    .exec((error, category) => {
      if (error) return res.status(400).json({ error });

      if (category) {
        Product.find({ category: category._id }).exec((error, products) => {
          if (error) return res.status(400).json({ error });

          if (products.length > 0) {
            res.status(200).json({
              products,
              productsByPrice: {
                under100k: products.filter(
                  (product) => product.price <= 100000
                ),
                under500k: products.filter(
                  (product) => product.price > 100000 && product.price <= 500000
                ),
                under1000k: products.filter(
                  (product) =>
                    product.price > 500000 && product.price <= 1000000
                ),
              },
            });
          }
        });
      }
    });
};

exports.getProductsById = (req, res) => {
  const { productId } = req.params;
  if (productId) {
    Product.findOne({ _id: productId }).exec((error, product) => {
      if (error) return res.status(400).json({ error });
      if (product) {
        res.status(200).json({ product });
      }
    });
  } else {
    return res.status(400).json({ error: "Loi thieu params" });
  }
};

exports.deleteProductById = (req, res) => {
  const { productId } = req.body.payload;
  if (productId) {
    Product.deleteOne({ _id: productId }).exec((error, result) => {
      if (error) return res.status(400).json({ error });
      if (result) {
        res.status(200).json({ result });
      }
    });
  } else {
    res.status(400).json({ error: "Params required" });
  }
};

exports.getAllProduct = async (req, res) => {
  const products = await Product.find({})
    .populate({ path: "category", select: "_id name" })
    .exec();
  res.status(200).json({ products });
};

exports.updateProduct = async (req, res) => {
  const {
    _id,
    name,
    price,
    quantity,
    description,
    productPictures,
    category,
    size,
    color,
    createdBy,
  } = req.body;

  const product = {
    name: name,
    slug: slugify(name),
    price: price,
    quantity: quantity,
    description: description,
    productPictures: productPictures,
    category: category,
    size: size,
    color: color,
    createdBy: req.user._id,
  };

  const updatedProduct = await Product.findOneAndUpdate({ _id }, product, {
    new: true,
  });
  res.status(200).json({ updatedProduct });
};

exports.getProductFilter = async (req, res) => {
  const resultPerPage = 8;
  const productsCount = await Product.countDocuments();

  const apiFeature = new ApiFeatures(Product.find(), req.query)
    .search()
    .filter();

  let productList = await apiFeature.query;
  let filteredProductsCount = productList.length;

  apiFeature.pagination(resultPerPage);

  productList = await apiFeature.query.clone();

  res.status(200).json({
    success: true,
    productList,
    productsCount,
    resultPerPage,
    filteredProductsCount,
  });
};

exports.getTopSoldProduct = async (req, res) => {
  try {
    const products = await Product.find()
      .populate({ path: "category", select: "_id name" })
      .sort({ sold: -1 })
      .limit(5);
    res.status(200).json(products);
  } catch (error) {
    res.status(400).json(error);
  }
};

exports.addReview = async (req, res) => {
  try {
    const { productId, review } = req.body;
    const newReview = {
      userId: req.user._id,
      review,
    };
    const product = await Product.findById(productId);
    const isReviewed = product.reviews.find(
      (rev) => rev.userId.toString() === req.user._id.toString()
    );

    if (isReviewed) {
      product.reviews.forEach((rev) => {
        if (rev.userId.toString() === req.user._id.toString())
          rev.review = review;
      });
    } else {
      product.reviews.push(newReview);
    }
    await product.save({ validateBeforeSave: false });
    res.status(200).json({
      success: true,
    });
  } catch (error) {
    res.status(400).json(error);
  }
};

exports.getAllReview = async (req, res) => {
  try {
    const product = await Product.findById(req.query.id);
    res.status(200).json({
      success: true,
      reviews: product.reviews,
    });
  } catch (error) {
    res.status(400).json(error);
  }
};

exports.updateSale = async (req, res) => {
  try {
    const saledProduct = {
      isSale: req.body.isSale,
      salePercent: req.body.salePercent,
    };
    await Product.findByIdAndUpdate(req.params.id, saledProduct, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(400).json(error);
  }
};
