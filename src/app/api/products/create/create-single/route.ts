import { NextRequest, NextResponse } from "next/server";
import { connectToMongoDB } from "@/lib/db";
import Products from "@/models/Products";
import { generateSlug } from "@/lib/utils";

// Custom error responses
const errorResponse = (message: string, status: number = 500) => {
  console.log(message);

  return NextResponse.json(
    {
      success: false,
      error: message,
    },
    { status }
  );
};

// Generate a simple 8-digit SKU based on the product count in the database
const generateSequentialSku = async () => {
  const productCount = await Products.countDocuments(); // Get the count of all products
  const skuNumber = (productCount + 1).toString().padStart(8, "0"); // Increment and pad to 8 digits
  return skuNumber;
};

export const POST = async (request: NextRequest) => {
  try {
    const {
      title,
      description,
      category,
      brand,
      price,
      salePrice,
      discount,
      isNew,
      variants,
      directions,
      ingredients,
      benefits,
      faqs,
      additionalInfo,

      bestBefore,

      heroBanner,
      dailyRitual,
      ingredientHighlights,
    } = await request.json();

    console.log({
      title,
      description,
      category,
      brand,
      price,
      salePrice,
      discount,
      isNew,
      variants,
      directions,
      ingredients,
      benefits,
      faqs,
      additionalInfo,

      bestBefore,

      heroBanner,
      dailyRitual,
      ingredientHighlights,
    });

    // Basic input validation
    if (!title || !description || !category || !brand || !price) {
      // console.log("Missing required fields");
      return errorResponse("Missing required fields", 400);
    }

    if (!Array.isArray(variants) || variants.length === 0) {
      // console.log("Missing required fields");
      return errorResponse("At least one variant is required", 400);
    }

    // Validate price and salePrice
    if (salePrice < 0 ? price < 0 : salePrice < 0) {
      // console.log("Price and sale price must be positive numbers");
      return errorResponse(
        "Price and sale price must be positive numbers",
        400
      );
    }

    if (salePrice > price) {
      // console.log("Sale price cannot be greater than regular price");
      return errorResponse(
        "Sale price cannot be greater than regular price",
        400
      );
    }

    // Validate arrays
    if (
      !Array.isArray(directions) ||
      !Array.isArray(ingredients) ||
      !Array.isArray(benefits)
    ) {
      // console.log("Directions, ingredients, and benefits must be arrays");
      return errorResponse(
        "Directions, ingredients, and benefits must be arrays",
        400
      );
    }

    await connectToMongoDB();

    const slug = generateSlug(category.title);
    const sku = await generateSequentialSku();

    let sell_on_google_quantity = 0;
    for (const variant of variants) {
      // Convert stock to number if it's a string and validate
      const stockValue =
        typeof variant.stock === "string"
          ? parseInt(variant.stock, 10)
          : variant.stock;

      if (
        !variant.hasOwnProperty("stock") ||
        isNaN(stockValue) ||
        stockValue < 0 ||
        !Number.isInteger(stockValue)
      ) {
        return errorResponse(
          "Stock quantity must be a valid non-negative integer for all variants",
          400
        );
      }
      // Update the variant stock with the converted number
      variant.stock = stockValue;
      sell_on_google_quantity += stockValue;
    }

    const newProduct = new Products({
      sku,
      title,
      description,
      category: {
        title: category.title,
        slug: category.slug,
      },
      brand,
      price,
      salePrice,
      discount,
      sell_on_google_quantity,
      new: isNew,
      variants,
      directions,
      ingredients,
      benefits,
      faqs,
      additionalInfo,
      ratings: 0,
      reviews_number: 0,

      bestBefore,

      heroBanner,
      dailyRitual,
      ingredientHighlights,
    });

    try {
      const savedProduct = await newProduct.save();
      return NextResponse.json(
        {
          success: true,
          message: `${savedProduct.title} product created successfully!`,
          product: savedProduct,
        },
        { status: 201 }
      );
    } catch (dbError: any) {
      // Handle MongoDB specific errors
      if (dbError.code === 11000) {
        return errorResponse("A product with this SKU already exists", 409);
      }
      throw dbError; // Re-throw other database errors
    }
  } catch (error: any) {
    console.error("Error creating product:", error);

    // Handle different types of errors
    if (error.message === "Invalid stock quantity") {
      return errorResponse("Stock quantity must be a positive number", 400);
    }

    if (error.name === "ValidationError") {
      return errorResponse(`Validation error: ${error.message}`, 400);
    }

    if (error.name === "MongoServerError") {
      return errorResponse("Database error occurred", 500);
    }

    return errorResponse(
      "An unexpected error occurred while creating the product",
      500
    );
  }
};