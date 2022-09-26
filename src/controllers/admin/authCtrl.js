const User = require("../../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

exports.signup = (req, res) => {
  User.findOne({ email: req.body.email }).exec(async (error, user) => {
    if (user) return res.status(400).json("Admin da ton tai");

    const { firstName, lastName, username, email, password } = req.body;

    const hash_password = await bcrypt.hash(password, 10);

    const _user = new User({
      firstName,
      lastName,
      username,
      email,
      hash_password,
      role: "admin",
    });

    _user.save((error, data) => {
      if (error) {
        return res.status(400).json("Sai thong tin");
      }
      if (data) {
        return res
          .status(200)
          .json({ message: "Admin created Successfully..!" });
      }
    });
  });
};

exports.signin = (req, res) => {
  User.findOne({ email: req.body.email }).exec(async (error, user) => {
    if (error) return res.status(400).json({ error });
    if (user) {
      const isPassword = await user.authenticate(req.body.password);
      if (isPassword && user.role === "admin") {
        const token = jwt.sign(
          { _id: user._id, role: user.role },
          process.env.JWT_SECRET,
          {
            expiresIn: "3d",
          }
        );

        const { _id, firstName, lastName, username, role, email, fullName } =
          user;
        res.cookie("token", token, { expiresIn: "2d" });
        res.status(200).json({
          token,
          user: { _id, firstName, lastName, username, role, email, fullName },
        });
      } else {
        return res.status(400).json({ message: "Mat khau ko dung" });
      }
    } else {
      return res.status(400).json({ message: "Sai thong tin dang nhap" });
    }
  });
};

exports.signout = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({
    message: "Dang xuat thanh cong",
  });
};
