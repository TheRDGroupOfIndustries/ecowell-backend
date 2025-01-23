"use client";

// Recommended

import { Fragment, useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { toast } from "react-toastify";
import { ProductManagementUI } from "./SpecialOfferProducts";
import CommonBreadcrumb from "@/CommonComponents/CommonBreadcrumb";
import { BiRefresh } from "react-icons/bi";

interface NewArrivalProduct {
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

const NewArrivalProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [newArrivalProducts, setNewArrivalProducts] = useState<
    NewArrivalProduct[]
  >([]);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const { data } = await axios.get("/api/products/new-arrival-products");

      const newArrivalIds =
        data?.newArrivalProducts?.map(
          (item: { product: string }) => item.product
        ) || [];

      const refreshedSelectedProducts = newArrivalIds
        .map((id: string) => products.find((product) => product._id === id))
        .filter(Boolean) as Product[];

      setSelectedProducts(refreshedSelectedProducts);
      setNewArrivalProducts(data?.newArrivalProducts || []);
      setHasChanges(false);
      toast.success("New arrival products refreshed from database");
    } catch (error) {
      console.error("Error refreshing new arrival products:", error);
      toast.error("Failed to refresh new arrival products");
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get("/api/products/new-arrival-products");
        const newArrivalItems = data?.newArrivalProducts || [];

        setNewArrivalProducts(newArrivalItems);
        setHasChanges(false);
      } catch (error) {
        console.error("Error fetching new arrival products:", error);
        toast.error("Failed to fetch new arrival products");
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
      await axios.put("/api/products/new-arrival-products/put", {
        newArrivalProducts,
      });
      toast.success("New arrival products updated successfully");
    } catch (error) {
      console.error("Error saving new arrival products:", error);
      toast.error("Failed to update new arrival products");
    } finally {
      setIsSaving(false);
      setHasChanges(false);
    }
  };

  return (
    <Fragment>
      <CommonBreadcrumb
        title="New Arrival Products"
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
        specialOfferProducts={newArrivalProducts}
        setSpecialOfferProducts={setNewArrivalProducts}
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

export default NewArrivalProducts;
