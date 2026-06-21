import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function GET() {
  try {
    await connectDB();

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      existingAdmin.role = "admin";
      await existingAdmin.save();

      return Response.json({
        success: true,
        message: "Mevcut kullanıcı admin yapıldı.",
      });
    }

    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    await User.create({
      name: "Admin",
      email: adminEmail,
      password: hashedPassword,
      role: "admin",
    });

    return Response.json({
      success: true,
      message: "Admin kullanıcı oluşturuldu.",
    });
  } catch (error) {
    return Response.json({
      success: false,
      message: error.message,
    });
  }
}
