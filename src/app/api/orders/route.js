import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { cookies } from "next/headers";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";

function createOrderCode() {
  const random = Math.floor(1000 + Math.random() * 9000);
  const time = Date.now().toString().slice(-6);

  return `VR-${time}${random}`;
}

export async function POST(req) {
  try {
    await connectDB();

    const { customerName, email, phone, address, products, total } =
      await req.json();

    if (!customerName || !email || !phone || !address) {
      return Response.json(
        { success: false, message: "Teslimat bilgileri eksik." },
        { status: 400 },
      );
    }

    if (!products || products.length === 0) {
      return Response.json(
        { success: false, message: "Sepet boş." },
        { status: 400 },
      );
    }

    let userId = null;

    try {
      const cookieStore = await cookies();
      const token = cookieStore.get("token")?.value;

      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        userId = decoded.id || decoded.userId || decoded._id || null;
      }
    } catch {
      userId = null;
    }

    for (const item of products) {
      if (!mongoose.Types.ObjectId.isValid(item.id)) {
        return Response.json(
          {
            success: false,
            message:
              "Sepetinizde eski veya geçersiz ürünler var. Lütfen sepeti temizleyip ürünleri tekrar ekleyin.",
          },
          { status: 400 },
        );
      }

      const product = await Product.findById(item.id);

      if (!product) {
        return Response.json(
          {
            success: false,
            message: `${item.name} ürünü artık mevcut değil.`,
          },
          { status: 404 },
        );
      }

      if (product.stock < item.quantity) {
        return Response.json(
          {
            success: false,
            message: `${item.name} için yeterli stok yok. Mevcut stok: ${product.stock}`,
          },
          { status: 400 },
        );
      }
    }

    for (const item of products) {
      await Product.findByIdAndUpdate(item.id, {
        $inc: { stock: -item.quantity },
      });
    }

    let orderCode = createOrderCode();

    const existingOrder = await Order.findOne({ orderCode });

    if (existingOrder) {
      orderCode = createOrderCode();
    }

    const order = await Order.create({
      orderCode,
      userId,
      customerName: customerName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      address: address.trim(),
      products,
      total: Number(total),
      status: "pending",
    });

    return Response.json(
      {
        success: true,
        message: "Sipariş oluşturuldu.",
        order,
        orderCode: order.orderCode,
      },
      { status: 201 },
    );
  } catch (error) {
    return Response.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}
