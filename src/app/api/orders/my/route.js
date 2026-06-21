import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import User from "@/models/User";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return Response.json(
        { success: false, message: "Giriş yapılmamış." },
        { status: 401 },
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const userId = decoded.id || decoded.userId || decoded._id;

    if (!userId) {
      return Response.json(
        { success: false, message: "Kullanıcı kimliği bulunamadı." },
        { status: 401 },
      );
    }

    await connectDB();

    const user = await User.findById(userId);

    if (!user) {
      return Response.json(
        { success: false, message: "Kullanıcı bulunamadı." },
        { status: 404 },
      );
    }

    const orders = await Order.find({
      $or: [
        { userId: String(user._id) },
        { userId: user._id },
        { email: user.email },
        { email: user.email?.toLowerCase() },
      ],
    }).sort({ createdAt: -1 });

    return Response.json({
      success: true,
      orders,
    });
  } catch (error) {
    return Response.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}
