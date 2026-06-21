import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return Response.json({ success: false, message: "Giriş yapılmamış." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    await connectDB();

    const user = await User.findById(decoded.id).select("cart favorites");

    if (!user) {
      return Response.json({
        success: false,
        message: "Kullanıcı bulunamadı.",
      });
    }

    return Response.json({
      success: true,
      cart: user.cart || [],
      favorites: user.favorites || [],
    });
  } catch (error) {
    return Response.json({ success: false, message: error.message });
  }
}

export async function POST(req) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return Response.json({ success: false, message: "Giriş yapılmamış." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { cart, favorites } = await req.json();

    await connectDB();

    await User.findByIdAndUpdate(decoded.id, {
      cart: cart || [],
      favorites: favorites || [],
    });

    return Response.json({
      success: true,
      message: "Kullanıcı verileri kaydedildi.",
    });
  } catch (error) {
    return Response.json({ success: false, message: error.message });
  }
}
