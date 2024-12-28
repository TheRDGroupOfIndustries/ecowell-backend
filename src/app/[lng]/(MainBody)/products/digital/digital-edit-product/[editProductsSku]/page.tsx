"use client";
import EditDigitalProduct from "@/Components/Products/Digital/EditDigitalProduct/[sku]";
import { useParams } from "next/navigation";

const EditDigitalProductContainer = () => {
  const params = useParams();
  const editProductsSku = Array.isArray(params.editProductsSku) ? params.editProductsSku[0] : params.editProductsSku;
  // console.log("Product Slug:", params);

  return <EditDigitalProduct editProductSku={editProductsSku} />;
};

export default EditDigitalProductContainer;
