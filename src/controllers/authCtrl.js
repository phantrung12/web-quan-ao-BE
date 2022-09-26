const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const generateJwtToken = (_id, role) => {
  return jwt.sign({ _id, role }, process.env.JWT_SECRET, {
    expiresIn: "3d",
  });
};

exports.signup = (req, res) => {
  User.findOne({ email: req.body.email }).exec(async (error, user) => {
    if (user) return res.status(400).json({ error: "Email đã tồn tại" });

    const { firstName, lastName, username, email, password } = req.body;

    const hash_password = await bcrypt.hash(password, 10);

    const _user = new User({
      firstName,
      lastName,
      username,
      email,
      hash_password,
      role: "user",
    });

    _user.save((error, user) => {
      if (error) {
        return res.status(400).json({ message: "Sai thông tin" });
      }
      if (user) {
        const token = generateJwtToken(user._id, user.role);
        const { _id, firstName, lastName, email, role, fullName } = user;
        return res.status(201).json({
          token,
          user: { _id, firstName, lastName, email, role, fullName },
        });
      }
    });
  });
};

exports.signin = (req, res) => {
  User.findOne({ email: req.body.email }).exec(async (error, user) => {
    if (error) return res.status(400).json({ error: "Email không hợp lệ" });
    if (user) {
      const isPassword = await user.authenticate(req.body.password);
      if (isPassword && user.role === "user") {
        // const token = jwt.sign(
        //   { _id: user._id, role: user.role },
        //   process.env.JWT_SECRET,
        //   {
        //     expiresIn: "3d",
        //   }
        // );

        // const { _id, firstName, lastName, username, role, email, fullName } = user;
        const token = generateJwtToken(user._id, user.role);
        const {
          _id,
          firstName,
          lastName,
          username,
          email,
          role,
          contactNumber,
          profilePicture,
          fullName,
        } = user;
        res.status(200).json({
          token,
          user: {
            _id,
            firstName,
            lastName,
            username,
            role,
            email,
            contactNumber,
            profilePicture,
            fullName,
          },
        });
      } else {
        return res.status(400).json({ error: "Sai mật khẩu" });
      }
    } else {
      return res.status(400).json({ error: "Sai thông tin đăng nhập" });
    }
  });
};
