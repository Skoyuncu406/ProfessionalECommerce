import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";

export async function GET(req, { params }) {
  try {
    await connectDB();

    const { id } = await params;
    const product = await Product.findById(id);

    if (!product) {
      return Response.json(
        { success: false, message: "Ürün bulunamadı." },
        { status: 404 },
      );
    }

    return Response.json({
      success: true,
      product,
    });
  } catch (error) {
    return Response.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}

export async function PUT(req, { params }) {
  try {
    await connectDB();

    const { id } = await params;
    const body = await req.json();

    const product = await Product.findByIdAndUpdate(
      id,
      {
        nameTr: body.nameTr,
        nameEn: body.nameEn,
        descriptionTr: body.descriptionTr,
        descriptionEn: body.descriptionEn,
        price: Number(body.price),
        stock: Number(body.stock),
        categoryId: body.categoryId,
        image: body.image || "/hero.jpg",
        images: body.images || [],
      },
      { new: true },
    );

    return Response.json({
      success: true,
      message: "Ürün güncellendi.",
      product,
    });
  } catch (error) {
    return Response.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectDB();

    const { id } = await params;

    await Product.findByIdAndDelete(id);

    return Response.json({
      success: true,
      message: "Ürün silindi.",
    });
  } catch (error) {
    return Response.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}
