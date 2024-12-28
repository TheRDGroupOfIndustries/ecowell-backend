'use client'
import ProductDetail from "@/Components/Products/Physical/ProductDetail";
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';

const ProductDetailContainer = () => {
  const { sku } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (sku) {
      const fetchProduct = async () => {
        try {
          setLoading(true);
          const response = await axios.get(`/api/products/get/${sku}`);
          // console.log("Fetched Product:", response.data);
          setProduct(response.data);
        } catch (error) {
          console.error("Error fetching product:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchProduct();
    }
  }, [sku]);

  return <ProductDetail product={product} loading={loading} />;
};

export default ProductDetailContainer;