const ImExport = require("../../models/ImExport");
const Product = require("../../models/Product");
const ApiFeatures = require("../../utils/apiFeatures");

exports.createImExport = async (req, res) => {
  const { productId, type, useId, quantity, createdBy } = req.body;

  const imexport = new ImExport({
    productId,
    quantity,
    type,
    createdBy: req.user._id,
  });

  const product = await Product.findById({ _id: productId });
  if (type === "import") {
    product.quantity += quantity;
  } else if (type === "export") {
    product.quantity -= quantity;
  }
  const newProduct = { ...product, quantity };
  const updateProduct = await Product.findOneAndUpdate(
    { _id: productId },
    newProduct,
    { new: true }
  );

  await imexport.save((error, imexport) => {
    if (error) return res.status(400).json({ error });
    if (imexport) {
      res.status(200).json({ imexport });
    }
  });
};

exports.getImExport = async (req, res) => {
  try {
    const resultPerPage = 10;
    const IEcount = await ImExport.countDocuments();
    const apiFeature = new ApiFeatures(
      ImExport.find()
        .populate({ path: "productId", select: "_id name" })
        .populate({ path: "createdBy", select: "_id username" }),
      req.query
    )
      .search()
      .filter();

    let imexportList = await apiFeature.query;
    let filteredIECount = imexportList.length;

    apiFeature.pagination(resultPerPage);

    imexportList = await apiFeature.query.clone();
    res.status(200).json({
      success: true,
      imexportList,
      IEcount,
      resultPerPage,
      filteredIECount,
    });
  } catch (error) {
    res.status(400).json({ error: error });
  }
};
