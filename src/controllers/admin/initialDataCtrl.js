const Category = require("../../models/Category");
const Order = require("../../models/Order");
const Product = require("../../models/Product");

function createCategories(categories, parentId = null) {
  const categoryList = [];
  let category;

  //Nếu parentId = null thì là category mẹ
  if (parentId == null) {
    category = categories.filter((cat) => cat.parentId == undefined); //Lọc từ danh sách categories ra các cate mẹ
  } else {
    category = categories.filter((cat) => cat.parentId == parentId); //Lọc ra các cate con từ ds categories có cùng parentId
  }

  for (let cate of category) {
    categoryList.push({
      _id: cate._id,
      name: cate.name,
      slug: cate.slug,
      parentId: cate.parentId,
      type: cate.type,
      children: createCategories(categories, cate._id),
    });
  }

  return categoryList;
}

exports.initialData = async (req, res) => {
  const categories = await Category.find({}).exec();
  const products = await Product.find({})
    .select(
      "_id name price quantity slug description productPictures category size color isSale salePercent"
    )
    .populate({ path: "category", select: "_id name" })
    .exec();
  const orders = await Order.find({})
    .populate("items.productId", "name")
    .exec();
  res.status(200).json({
    categoryList: categories,
    categories: createCategories(categories),
    products,
    orders,
  });
};
