const Order = require("../../models/Order");

exports.updateOrder = (req, res) => {
  Order.updateOne(
    { _id: req.body.orderId, "orderStatus.type": req.body.type },
    {
      $set: {
        "orderStatus.$": [
          { type: req.body.type, date: new Date(), isCompleted: true },
        ],
      },
    }
  ).exec((error, order) => {
    if (error) return res.status(400).json({ error });
    if (order) {
      res.status(200).json({ order });
    }
  });
};

exports.getCustomerOrders = async (req, res) => {
  const orders = await Order.find({})
    .populate("items.productId", "name")
    .exec();
  res.status(200).json({ orders });
};

exports.income = async (req, res) => {
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

  try {
    const incomes = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: previousMonth.toISOString() },
          ...(productId && {
            items: { $elemMatch: { productId } },
          }),
        },
      },
      {
        $project: { month: { $month: "$createdAt" }, sales: "$totalAmount" },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: "$sales" },
        },
      },
    ]);

    res.status(200).json({ success: true, incomes });
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.countPayment = async (req, res) => {
  try {
    const countPayment = await Order.aggregate([
      {
        $group: {
          _id: {
            __alias_0: "$paymentStatus",
          },
          __alias_1: {
            $sum: {
              $cond: [
                {
                  $ne: [
                    {
                      $type: "$paymentStatus",
                    },
                    "missing",
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          __alias_0: "$_id.__alias_0",
          __alias_1: 1,
        },
      },
      {
        $project: {
          label: "$__alias_0",
          value: "$__alias_1",
          _id: 0,
        },
      },
      {
        $addFields: {
          __agg_sum: {
            $sum: ["$value"],
          },
        },
      },
      {
        $sort: {
          __agg_sum: -1,
        },
      },
      {
        $project: {
          __agg_sum: 0,
        },
      },
      {
        $limit: 5000,
      },
    ]);
    res.status(200).json({ success: true, countPayment });
  } catch (error) {
    res.status(400).json(error);
  }
};

exports.countOrder = async (req, res) => {
  try {
    const countOrder = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: {
              $date: "2022-01-01T00:00:00.000Z",
            },
            $lt: {
              $date: "2023-01-01T00:00:00.000Z",
            },
          },
        },
      },
      {
        $addFields: {
          createdAt: {
            $cond: {
              if: {
                $eq: [
                  {
                    $type: "$createdAt",
                  },
                  "date",
                ],
              },
              then: "$createdAt",
              else: null,
            },
          },
        },
      },
      {
        $addFields: {
          __alias_0: {
            year: {
              $year: "$createdAt",
            },
            month: {
              $month: "$createdAt",
            },
          },
        },
      },
      {
        $group: {
          _id: {
            __alias_0: "$__alias_0",
          },
          __alias_1: {
            $sum: 1,
          },
        },
      },
      {
        $project: {
          _id: 0,
          __alias_0: "$_id.__alias_0",
          __alias_1: 1,
        },
      },
      {
        $project: {
          x: "$__alias_0",
          y: "$__alias_1",
          _id: 0,
        },
      },
    ]);
    res.status(200).json({ success: true, countOrder });
  } catch (error) {
    res.status(400).json(error);
  }
};

exports.countIncome = async (req, res) => {
  try {
    const countIncome = await Order.aggregate([
      {
        $addFields: {
          createdAt: {
            $cond: {
              if: {
                $eq: [
                  {
                    $type: "$createdAt",
                  },
                  "date",
                ],
              },
              then: "$createdAt",
              else: null,
            },
          },
        },
      },
      {
        $addFields: {
          __alias_0: {
            year: {
              $year: "$createdAt",
            },
            month: {
              $subtract: [
                {
                  $month: "$createdAt",
                },
                1,
              ],
            },
          },
        },
      },
      {
        $group: {
          _id: {
            __alias_0: "$__alias_0",
          },
          __alias_1: {
            $sum: "$totalAmount",
          },
        },
      },
      {
        $project: {
          _id: 0,
          __alias_0: "$_id.__alias_0",
          __alias_1: 1,
        },
      },
      {
        $project: {
          y: "$__alias_1",
          x: "$__alias_0",
          _id: 0,
        },
      },
      {
        $sort: {
          "x.year": 1,
          "x.month": 1,
        },
      },
      {
        $limit: 5000,
      },
    ]);
    res.status(200).json({ success: true, countIncome });
  } catch (error) {
    res.status(400).json(error);
  }
};
