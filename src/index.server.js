const express = require("express");
const dotenv = require("dotenv");
// const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin/auth");
const categoryRoutes = require("./routes/category");
const productRoutes = require("./routes/product");
const cartRoutes = require("./routes/cart");
const initialDataRoutes = require("./routes/admin/initialData");
const pageRoutes = require("./routes/admin/page");
const addressRoutes = require("./routes/address");
const orderRoutes = require("./routes/order");
const userRoutes = require("./routes/admin/user");
const adminOrderRoutes = require("./routes/admin/order.admin");
const chatRoutes = require("./routes/chat");
const messageRoute = require("./routes/message");
const conversationRoute = require("./routes/conversation");
const imexportRoute = require("./routes/admin/imexport");

const app = express();

dotenv.config();

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("DB is connected"))
  .catch((err) => console.log(err));

app.use(cors());
app.use(express.json());
app.use("/public", express.static(path.join(__dirname, "uploads")));

app.use("/api", authRoutes);
app.use("/api", adminRoutes);
app.use("/api", categoryRoutes);
app.use("/api", productRoutes);
app.use("/api", cartRoutes);
app.use("/api", initialDataRoutes);
app.use("/api", pageRoutes);
app.use("/api", addressRoutes);
app.use("/api", orderRoutes);
app.use("/api", userRoutes);
app.use("/api", adminOrderRoutes);
app.use("/api", imexportRoute);
app.use("/api", conversationRoute);
app.use("/api", messageRoute);

app.listen(process.env.PORT, () => {
  console.log("Server is running ");
});
