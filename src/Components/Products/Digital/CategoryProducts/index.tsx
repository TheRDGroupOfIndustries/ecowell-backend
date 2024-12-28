import CommonBreadcrumb from "@/CommonComponents/CommonBreadcrumb";
import CommonCardHeader from "@/CommonComponents/CommonCardHeader";
import Datatable from "@/CommonComponents/DataTable";
import { Fragment, useState, useEffect } from "react";
import { Card, CardBody, Col, Container, Row } from "reactstrap";
import axios from 'axios';
import { toast } from "react-toastify";
import { useRouter, useParams } from "next/navigation";

const CategoryProducts = ({categorySlug}:{
  categorySlug: string;
}) => {
  const [categoryProductsData, setCategoryProductsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/categories/${categorySlug}`);
        // console.log("Fetched Category Products:", response.data);
        const transformedData = response.data.map((product: any) => ({
          sku: product.sku,
          image_link: product.variants[0].images[0],
          title: product.title,
          brand: product.brand,
          price: product.price,
          category_slug: product.category.slug,
          sell_on_google_quantity: product.sell_on_google_quantity,
          variants_count: product.variants.length,
        }));
        setCategoryProductsData(transformedData);
      } catch (error) {
        console.error("Error fetching category products:", error);
        toast.error("Failed to fetch category products");
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryProducts();
  }, [categorySlug]);

  return (
    <Fragment>
      <CommonBreadcrumb title={categorySlug} parent="products/digital" />
      <Container fluid>
        <Row>
          <Col sm="12">
            <Card>
              <CommonCardHeader title={categorySlug} />
              <CardBody className="pt-0">
                <div className="clearfix"></div>
                <div id="basicScenario" className="product-physical products-list">
                  <Datatable
                    multiSelectOption={false}
                    myData={categoryProductsData}
                    pageSize={9}
                    pagination={false}
                    class="-striped -highlight"
                    isDelete={true}
                    onClickField={"sku"}
                    loading={loading}
                    handleOnClick={(row:any) => {
                      console.log("Clicked SKU:", row.sku);
                      router.push(`/en/products/digital/product-detail/${row.category_slug}/${row.sku}`);
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

export default CategoryProducts;