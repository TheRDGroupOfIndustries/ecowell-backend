"use client";

import CommonBreadcrumb from "@/CommonComponents/CommonBreadcrumb";
import CommonCardHeader from "@/CommonComponents/CommonCardHeader";
import Datatable from "@/CommonComponents/DataTable";
import { Fragment, useState, useEffect } from "react";
import { Card, CardBody, Col, Container, Row } from "reactstrap";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const ProductListDigital = () => {
  const [productListDigitalData, setProductListDigitalData] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/products/get/get-all-products");
        const transformedData = response.data.reverse().map((product: any) => ({
          sku: product.sku,
          image_link: product.variants[0].images[0],
          title: product.title,
          brand: product.brand,
          salePrice: product.salePrice,
          price: product.price,
          category_slug: product.category.slug,
          sell_on_google_quantity: product.sell_on_google_quantity,
          variants_count: product.variants.length,
          // heroBanner: product.heroBanner ? "Yes" : "No",
          // dailyRitual: product.dailyRitual ? "Yes" : "No",
          // ingredientHighlights: product.ingredientHighlights
          //   ? product.ingredientHighlights.length
          //   : 0,
        }));
        setProductListDigitalData(transformedData);
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const onDelete = async (row: any) => {
    try {
      const response = await axios.delete(`/api/products/delete/${row.sku}`);
      console.log("Delete Response:", response.data);
      toast.success("Product deleted successfully!");
      return true;
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product");
      return false;
    }
  };
  return (
    <Fragment>
      <CommonBreadcrumb title="Product List" parent="products/digital" />
      <Container fluid>
        <Row>
          <Col sm="12">
            <Card>
              <CommonCardHeader title="Product Lists" />
              <CardBody className="pt-0">
                <div className="clearfix"></div>
                <div
                  id="basicScenario"
                  className="product-physical products-list"
                >
                  <Datatable
                    multiSelectOption={false}
                    myData={productListDigitalData}
                    pageSize={9}
                    pagination={false}
                    class="-striped -highlight"
                    isDelete={true}
                    isEditable={true}
                    handleOpenEditModal={(row: any) => {
                      console.log("Edit Row:", row);
                      router.push(
                        `/en/products/digital/digital-edit-product/${row.sku}`
                      );
                    }}
                    onDelete={onDelete}
                    onClickField={"sku"}
                    loading={loading}
                    handleOnClick={(row: any) => {
                      console.log("Clicked SKU:", row.sku);
                      router.push(
                        `/en/products/digital/product-detail/${row.category_slug}/${row.sku}`
                      );
                    }}
                  />
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </Fragment>
  );
};

export default ProductListDigital;
