import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";

export async function PUT(req, { params }) {
  try {
    await connectDB();

    const { id } = await params;
    const { status } = await req.json();

    const order = await Order.findByIdAndUpdate(id, { status }, { new: true });

    return Response.json({
      success: true,
      message: "Sipariş durumu güncellendi.",
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

export async function DELETE(req, { params }) {
  try {
    await connectDB();

    const { id } = await params;

    await Order.findByIdAndDelete(id);

    return Response.json({
      success: true,
      message: "Sipariş silindi.",
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
