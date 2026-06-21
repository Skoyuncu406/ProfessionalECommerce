import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return Response.json({
        success: false,
        user: null,
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    await connectDB();

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return Response.json({
        success: false,
        user: null,
      });
    }

    return Response.json({
      success: true,
      user,
    });
  } catch (error) {
    return Response.json({
      success: false,
      user: null,
    });
  }
}
