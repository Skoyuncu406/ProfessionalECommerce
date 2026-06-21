import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";

export async function GET() {
  try {
    await connectDB();

    const products = await Product.find().sort({
      createdAt: -1,
    });

    return Response.json({
      success: true,
      products,
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

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();

    const product = await Product.create({
      nameTr: body.nameTr,
      nameEn: body.nameEn,
      descriptionTr: body.descriptionTr,
      descriptionEn: body.descriptionEn,
      price: Number(body.price),
      stock: Number(body.stock),
      categoryId: body.categoryId,
      image: body.image || "/hero.jpg",
      images: body.images || [],
    });

    return Response.json({
      success: true,
      product,
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
