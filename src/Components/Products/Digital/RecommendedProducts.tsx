"use client";

import { Fragment, useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { toast } from "react-toastify";
import { ProductManagementUI } from "./SpecialOfferProducts";
import CommonBreadcrumb from "@/CommonComponents/CommonBreadcrumb";
import { BiRefresh } from "react-icons/bi";

interface RecommendedProduct {
  index: number;
  product: string;
}

interface Product {
  _id: string;
  sku: string;
  image_link: string;
  title: string;
  brand: string;
  salePrice: number | null;
  price: number | null;
  category_slug: string;
  sell_on_google_quantity: number;
  variants_count: number;
  heroBanner: string;
  dailyRitual: string;
  ingredientHighlights: number;
}

const RecommendedProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [recommendedProducts, setRecommendedProducts] = useState<
    RecommendedProduct[]
  >([]);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const { data } = await axios.get("/api/products/recommended-products");
      const specialOfferIds =
        data?.recommendedProducts?.map(
          (item: { product: string }) => item.product
        ) || [];

      const refreshedSelectedProducts = specialOfferIds
        .map((id: string) => products.find((product) => product._id === id))
        .filter(Boolean) as Product[];

      setSelectedProducts(refreshedSelectedProducts);
      setRecommendedProducts(data?.recommendedProducts || []);
      setHasChanges(false);
      toast.success("Recommended products refreshed from database");
    } catch (error) {
      console.error("Error refreshing products:", error);
      toast.error("Failed to refresh products");
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get("/api/products/recommended-products");
        // console.log(data);
        const recommendedItems = data?.recommendedProducts || [];

        setRecommendedProducts(recommendedItems);
        setHasChanges(false);
      } catch (error) {
        console.error("Error fetching recommended products:", error);
        toast.error("Failed to fetch recommended products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleSaveProducts = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await axios.put("/api/products/recommended-products/put", {
        recommendedProducts,
      });
      toast.success("Recommended products updated successfully");
    } catch (error) {
      console.error("Error saving recommended products:", error);
      toast.error("Failed to update recommended products");
    } finally {
      setIsSaving(false);
      setHasChanges(false);
    }
  };

  return (
    <Fragment>
      <CommonBreadcrumb
        title="Recommended Products"
        parent="products/digital"
        element={
          <div className="d-flex gap-2 justify-content-end">
            {products.length > 0 && (
              <>
                <button
                  type="button"
                  className="btn btn-outline-primary px-4 py-2"
                  onClick={handleRefresh}
                  disabled={isRefreshing || isSaving}
                >
                  {isRefreshing ? (
                    <span className="spinner-border spinner-border-sm" />
                  ) : (
                    <BiRefresh size={20} />
                  )}
                </button>
                <button
                  type="button"
                  className="btn btn-primary px-4 py-2"
                  onClick={handleSaveProducts}
                  disabled={!hasChanges || isSaving || isRefreshing || loading}
                >
                  {isSaving ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" />
                      Saving...
                    </>
                  ) : (
                    `Save (${selectedProducts.length})`
                  )}
                </button>
              </>
            )}
            <Link
              href="/en/products/digital/digital-product-list"
              className="btn btn-outline-secondary px-4 py-2"
            >
              Cancel
            </Link>
          </div>
        }
      />

      <ProductManagementUI
        products={products}
        setProducts={setProducts}
        specialOfferProducts={recommendedProducts}
        setSpecialOfferProducts={setRecommendedProducts}
        selectedProducts={selectedProducts}
        setSelectedProducts={setSelectedProducts}
        setHasChanges={setHasChanges}
        loading={loading}
        setLoading={setLoading}
        isRefreshing={isRefreshing}
      />
    </Fragment>
  );
};

export default RecommendedProducts;
