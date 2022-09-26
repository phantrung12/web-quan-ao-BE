const Cart = require("../models/Cart");

function runUpdate(condition, updateData) {
  return new Promise((resolve, reject) => {
    //you update code here

    Cart.findOneAndUpdate(condition, updateData, { upsert: true })
      .then((result) => resolve(result))
      .catch((err) => reject(err));
  });
}

exports.addItemToCart = (req, res) => {
  Cart.findOne({ user: req.user._id }).exec((error, cart) => {
    if (error) return res.status(400).json(error);
    if (cart) {
      //Nếu đã tồn tại sp trong giỏ hàng, update giỏ hàng
      // res.status(200).json(cart);
      let promiseArray = [];

      req.body.cartItems.forEach((cartItem) => {
        const products = cartItem.products;
        const size = cartItem.size;
        const color = cartItem.color;
        // const item = cart.cartItems.filter((c) => {
        //   return c.products == products && c.size == size && c.color == color;
        // });
        const item = cart.cartItems.find(
          (c) => c.products == products && c.size == size && c.color == color
        );
        let condition, update;
        if (item) {
          condition = { user: req.user._id, "cartItems.products": products };
          update = {
            $set: {
              "cartItems.$": cartItem,
            },
          };
        } else {
          condition = { user: req.user._id };
          update = {
            $push: { cartItems: cartItem },
          };
        }
        promiseArray.push(runUpdate(condition, update));
      });
      Promise.all(promiseArray)
        .then((response) => res.status(200).json({ response }))
        .catch((error) => res.status(400).json({ error }));

      // Cart.findOneAndUpdate(condition, update).exec((err, _cart) => {
      //   if (err) return res.status(400).json({ err });
      //   if (_cart) {
      //     return res.status(200).json({ cart: _cart });
      //   }
      // });
    } else {
      //chưa thì thêm vào gh
      const cart = new Cart({
        user: req.user._id,
        cartItems: req.body.cartItems,
      });

      cart.save((error, cart) => {
        if (error) return res.status(400).json(error);
        if (cart) {
          res.status(200).json({ cart });
        }
      });
    }
  });
};

exports.getCartItems = (req, res) => {
  //const { user } = req.body.payload;
  //if(user){
  Cart.findOne({ user: req.user._id })
    .populate("cartItems.products", "_id name price productPictures")
    .exec((error, cart) => {
      if (error) return res.status(400).json({ error });
      if (cart) {
        let cartItems = {};
        cart.cartItems.forEach((item, index) => {
          // console.log(item.products);
          cartItems[index] = {
            _id: item.products._id.toString(),
            name: item.products.name,
            img: item.products.productPictures[0].img,
            price: item.products.price,
            color: item.color,
            size: item.size,
            qty: item.quantity,
          };
        });
        res.status(200).json({ cartItems });
        // res.status(200).json({ cart });
        // console.log(cart.cartItems[0]?.products?._id);
      }
    });
  //}
};

// new update remove cart items
exports.removeCartItems = (req, res) => {
  const { productId, size, color } = req.body.payload;
  if (productId) {
    Cart.update(
      { user: req.user._id },
      {
        $pull: {
          cartItems: {
            products: productId,
            size: size,
            color: color,
          },
        },
      }
    ).exec((error, result) => {
      if (error) return res.status(400).json({ error });
      if (result) {
        res.status(202).json({ result });
      }
    });
  }
};
