import { connectDB } from "@/lib/mongodb";
import Category from "@/models/Category";

export async function GET(req, { params }) {
  try {
    await connectDB();

    const { id } = await params;
    const category = await Category.findById(id);

    if (!category) {
      return Response.json(
        { success: false, message: "Kategori bulunamadı." },
        { status: 404 },
      );
    }

    return Response.json({
      success: true,
      category,
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

    const category = await Category.findByIdAndUpdate(
      id,
      {
        nameTr: body.nameTr,
        nameEn: body.nameEn,
        slug: body.slug,
        image: body.image || "/hero.jpg",
      },
      { new: true },
    );

    return Response.json({
      success: true,
      message: "Kategori güncellendi.",
      category,
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

    await Category.findByIdAndDelete(id);

    return Response.json({
      success: true,
      message: "Kategori silindi.",
    });
  } catch (error) {
    return Response.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}
