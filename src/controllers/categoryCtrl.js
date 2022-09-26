const Category = require("../models/Category");
const { default: slugify } = require("slugify");

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

exports.addCategory = (req, res) => {
  const cateObj = {
    name: req.body.name,
    slug: slugify(req.body.name),
  };

  if (req.file) {
    cateObj.categoryImage = process.env.API + "/public/" + req.file.filename;
  }

  if (req.body.parentId) {
    cateObj.parentId = req.body.parentId;
  }

  const cat = new Category(cateObj);
  cat.save((error, category) => {
    if (error) return res.status(400).json({ error });
    if (category) {
      return res.status(200).json({ category });
    }
  });
};

exports.getCategories = (req, res) => {
  Category.find().exec((error, categories) => {
    if (error) return res.status(400).json({ error });
    if (categories) {
      const categoryList = createCategories(categories);
      res.status(200).json({ categoryList });
    }
  });
};

exports.updateCategory = async (req, res) => {
  const { _id, name, parentId, type } = req.body;
  const updatedCategories = [];

  if (name instanceof Array) {
    for (let i = 0; i < name.length; i++) {
      const cate = {
        name: name[i],
        type: type[i],
      };
      if (parentId[i] !== "") {
        cate.parentId = parentId[i];
      }

      const updatedCategory = await Category.findOneAndUpdate(
        { _id: _id[i] },
        cate,
        { new: true }
      );
      updatedCategories.push(updatedCategory);
    }
    return res.status(200).json({ updateCategories: updatedCategories });
  } else {
    const category = {
      name: name,
      type: type,
    };
    if (parentId !== "") {
      category.parentId = parentId;
    }
    const updatedCategory = await Category.findOneAndUpdate({ _id }, category, {
      new: true,
    });
    return res.status(200).json({ updatedCategory });
  }
};

exports.deleteCategory = async (req, res) => {
  const { ids } = req.body.payload;
  const deletedCategories = [];
  for (let i = 0; i < ids.length; i++) {
    const deleteCategory = await Category.findOneAndDelete({ _id: ids[i]._id });
    deletedCategories.push(deleteCategory);
  }

  if (deletedCategories.length > 0) {
    res.status(200).json({ message: "Category removed" });
  } else {
    res.status(400).json({ message: "Lỗi" });
  }
};
