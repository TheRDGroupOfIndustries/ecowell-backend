import { NextRequest, NextResponse } from "next/server";
import { connectToMongoDB } from "@/lib/db";
import Products from "@/models/Products";
import { generateSlug } from "@/lib/utils";
import { revalidatePath } from "next/cache";

const generateSequentialSku = async () => {
  const productCount = await Products.countDocuments();
  return (productCount + 1).toString().padStart(8, "0");
};

const validateProductData = (product: any) => {
  const requiredFields = {
    title: "Title",
    description: "Description",
    category: {
      title: "Category Title",
      slug: "Category Slug",
    },
    brand: "Brand",
    price: "Price",
    salePrice: "Sale Price",
    variants: [
      {
        flavor: "Variant Flavor",
        images: "Variant Images",
        stock: "Variant Stock",
        form: "Variant Form",
        netQuantity: "Net Quantity",
        nutritionFacts: "Nutrition Facts",
        servingSize: "Serving Size",
      },
    ],
    bestBefore: "Best Before Date",
    directions: "Directions",
    ingredients: "Ingredients",
    benefits: "Benefits",
    additionalInfo: {
      manufacturedBy: "Manufacturer",
      countryOfOrigin: "Country of Origin",
      phone: "Phone",
      email: "Email",
    },
  };

  const missingFields: string[] = [];

  for (const [key, value] of Object.entries(requiredFields)) {
    if (key === "category") {
      if (!product.category?.title) missingFields.push("Category Title");
      if (!product.category?.slug) missingFields.push("Category Slug");
    } else if (key === "additionalInfo") {
      if (!product.additionalInfo?.manufacturedBy)
        missingFields.push("Manufacturer");
      if (!product.additionalInfo?.countryOfOrigin)
        missingFields.push("Country of Origin");
      if (!product.additionalInfo?.phone) missingFields.push("Phone");
      if (!product.additionalInfo?.email) missingFields.push("Email");
    } else if (key === "variants") {
      if (!Array.isArray(product.variants) || product.variants.length === 0) {
        missingFields.push("Variants");
      } else {
        product.variants.forEach((variant: any, index: number) => {
          if (!variant.flavor)
            missingFields.push(`Variant ${index + 1} Flavor`);
          if (!Array.isArray(variant.images) || variant.images.length === 0)
            missingFields.push(`Variant ${index + 1} Images`);
          if (typeof variant.stock !== "number")
            missingFields.push(`Variant ${index + 1} Stock`);
          if (!variant.form) missingFields.push(`Variant ${index + 1} Form`);
          if (!variant.netQuantity)
            missingFields.push(`Variant ${index + 1} Net Quantity`);
          if (
            !Array.isArray(variant.nutritionFacts) ||
            variant.nutritionFacts.length === 0
          )
            missingFields.push(`Variant ${index + 1} Nutrition Facts`);
          if (!variant.servingSize)
            missingFields.push(`Variant ${index + 1} Serving Size`);
        });
      }
    } else if (!product[key]) {
      missingFields.push(value as string);
    }
  }

  return missingFields;
};

export const POST = async (request: NextRequest) => {
  try {
    const products = await request.json();

    if (!Array.isArray(products) || products.length === 0) {
      revalidatePath(request.url);
      return NextResponse.json(
        { error: "Expected an array of products" },
        { status: 400 }
      );
    }

    console.log(`Received ${products.length} products for creation.`);

    await connectToMongoDB();

    const savedProducts: any[] = [];
    const errors: any[] = [];

    for (let index = 0; index < products.length; index++) {
      const product = products[index];
      const missingFields = validateProductData(product);

      if (missingFields.length > 0) {
        errors.push({
          productIndex: index,
          error: `Missing fields: ${missingFields.join(", ")}`,
        });
        continue;
      }

      try {
        const sku = await generateSequentialSku();
        const sell_on_google_quantity = product.variants.reduce(
          (total: number, variant: any) => total + Number(variant.stock || 0),
          0
        );

        const newProduct = new Products({
          sku,
          title: product.title,
          description: product.description,
          category: product.category,
          brand: product.brand,
          price: product.price,
          salePrice: product.salePrice,
          discount: product.discount,
          sell_on_google_quantity,
          new: product.isNew || false,
          isSingleVariantProduct: product.isSingleVariantProduct,
          variants: product.variants.map((variant: any) => ({
            ...variant,
            allergens: variant.allergens || [],
          })),
          bestBefore: product.bestBefore,
          directions: product.directions,
          ingredients: product.ingredients,
          benefits: product.benefits,
          faqs: product.faqs || [],
          additionalInfo: product.additionalInfo,
          heroBanner: product.heroBanner || {},
          dailyRitual: product.dailyRitual || {},
          ingredientHighlights: product.ingredientHighlights || [],
          ratings: 0,
          reviews_number: 0,
        });

        const savedProduct = await newProduct.save();
        savedProducts.push(savedProduct);
      } catch (error: any) {
        errors.push({
          productIndex: index,
          error: `Database Error: ${error.message || "Unknown error"}`,
        });
      }
    }

    if (errors.length > 0) {
      console.warn("Errors during product creation:", errors);
      revalidatePath(request.url);
      return NextResponse.json(
        {
          message: "Some products failed to save.",
          savedProducts,
          errors,
        },
        { status: 207 } // Multi-Status for partial success
      );
    }

    revalidatePath(request.url);
    return NextResponse.json(
      {
        message: `${savedProducts.length} products created successfully!`,
        products: savedProducts,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error in product creation:", error);
    revalidatePath(request.url);
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred." },
      { status: 500 }
    );
  }
};
