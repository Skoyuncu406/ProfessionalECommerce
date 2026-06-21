import { connectDB } from "@/lib/mongodb";
import Category from "@/models/Category";

export async function GET() {
  try {
    await connectDB();

    const categories = await Category.find().sort({ createdAt: -1 });

    return Response.json({
      success: true,
      categories,
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

    const { nameTr, nameEn, slug, image } = await req.json();

    if (!nameTr || !nameEn || !slug) {
      return Response.json(
        {
          success: false,
          message: "Kategori adı TR, kategori adı EN ve slug zorunludur.",
        },
        { status: 400 },
      );
    }

    const cleanSlug = slug.trim().toLowerCase();

    const exists = await Category.findOne({ slug: cleanSlug });

    if (exists) {
      return Response.json(
        {
          success: false,
          message: "Bu kategori zaten mevcut.",
        },
        { status: 409 },
      );
    }

    const category = await Category.create({
      nameTr: nameTr.trim(),
      nameEn: nameEn.trim(),
      slug: cleanSlug,
      image: image || "/hero.jpg",
    });

    return Response.json(
      {
        success: true,
        message: "Kategori başarıyla eklendi.",
        category,
      },
      { status: 201 },
    );
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
