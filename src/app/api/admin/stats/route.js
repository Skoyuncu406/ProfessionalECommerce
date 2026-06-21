import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import Category from "@/models/Category";
import User from "@/models/User";
import Order from "@/models/Order";

export async function GET() {
  try {
    await connectDB();

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const [
      totalProducts,
      totalCategories,
      totalUsers,
      totalOrders,
      todayOrders,
      pendingOrders,
      lowStockProducts,
      revenueData,
      latestOrders,
      lowStockList,
    ] = await Promise.all([
      Product.countDocuments(),
      Category.countDocuments(),
      User.countDocuments(),
      Order.countDocuments(),
      Order.countDocuments({
        createdAt: {
          $gte: todayStart,
        },
      }),
      Order.countDocuments({
        status: "pending",
      }),
      Product.countDocuments({
        stock: {
          $lte: 5,
        },
      }),
      Order.aggregate([
        {
          $match: {
            status: {
              $in: ["completed", "shipped", "preparing", "pending"],
            },
          },
        },
        {
          $group: {
            _id: null,
            totalRevenue: {
              $sum: "$total",
            },
          },
        },
      ]),
      Order.find()
        .sort({
          createdAt: -1,
        })
        .limit(5),
      Product.find({
        stock: {
          $lte: 5,
        },
      })
        .sort({
          stock: 1,
        })
        .limit(5),
    ]);

    return Response.json({
      success: true,
      stats: {
        totalProducts,
        totalCategories,
        totalUsers,
        totalOrders,
        todayOrders,
        pendingOrders,
        lowStockProducts,
        totalRevenue: revenueData[0]?.totalRevenue || 0,
        latestOrders,
        lowStockList,
      },
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 },
    );
  }
}
