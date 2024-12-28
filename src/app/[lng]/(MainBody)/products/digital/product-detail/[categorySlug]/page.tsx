"use client";
import CategoryProducts from "@/Components/Products/Digital/CategoryProducts";
import { useParams } from "next/navigation";

const CategoryProductsContainer = () => {
  const params = useParams();
  const categorySlug = Array.isArray(params.categorySlug) ? params.categorySlug[0] : params.categorySlug;
  console.log("Category Slug:", categorySlug);

  return <CategoryProducts categorySlug={categorySlug} />;
};

export default CategoryProductsContainer;