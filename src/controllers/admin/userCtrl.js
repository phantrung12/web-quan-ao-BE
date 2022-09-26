const User = require("../../models/User");

exports.getAllUser = async (req, res) => {
  const users = await User.find({}).exec((error, users) => {
    if (error) return res.status(400).json({ error });
    if (users) {
      res.status(200).json({ users });
    }
  });
};

exports.getUserById = (req, res) => {
  const { id } = req.params;
  if (id) {
    User.findOne({ _id: id }).exec((error, data) => {
      if (error) return res.status(400).json({ error });
      if (data) {
        const { hash_password, ...user } = data._doc;
        res.status(200).json({ user });
      }
    });
  } else {
    return res.status(401).json("Thieu params");
  }
};

exports.updateUserRole = async (req, res) => {
  const newUserData = {
    username: req.body.username,
    email: req.body.email,
    role: req.body.role,
  };

  await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({ success: true });
};

exports.updateUser = async (req, res) => {
  const {
    firstName,
    lastName,
    username,
    email,
    contactNumber,
    profilePicture,
  } = req.body;
  try {
    const updatedProduct = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      {
        new: true,
      }
    );
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.deleteUser = async (req, res) => {
  const user = await User.findByIdAndRemove(req.params.id);

  res.status(200).json({ success: true, message: "User Deleted Successfully" });
};

exports.statUser = async (req, res) => {
  const date = new Date();
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

  try {
    const data = await User.aggregate([
      { $match: { createdAt: { $gte: lastYear } } },
      {
        $project: {
          month: { $month: "createdAt" },
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: 1 },
        },
      },
    ]);
    res.status(400).json(data);
  } catch (error) {
    res.status(500).json(error);
  }
};
