import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";

export async function POST(req) {
  try {
    await connectDB();

    const { orderCode, email } = await req.json();

    if (!orderCode || !email) {
      return Response.json(
        {
          success: false,
          message: "Sipariş kodu ve e-posta zorunludur.",
        },
        { status: 400 },
      );
    }

    const order = await Order.findOne({
      orderCode: orderCode.trim().toUpperCase(),
      email: email.trim().toLowerCase(),
    });

    if (!order) {
      return Response.json(
        {
          success: false,
          message: "Sipariş bulunamadı.",
        },
        { status: 404 },
      );
    }

    return Response.json({
      success: true,
      order,
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
