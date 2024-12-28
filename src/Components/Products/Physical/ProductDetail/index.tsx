import CommonBreadcrumb from "@/CommonComponents/CommonBreadcrumb";
import { Card, CardBody, Container, Row } from "reactstrap";
import ProductDetailSlider from "./ProductDetailSlider";
import ProductInformation from "./ProductInformation";
import { useState, useEffect } from "react";

const ProductDetail = ({ product, loading }: any) => {
  const [selectedFlavor, setSelectedFlavor] = useState<any>(null);

  useEffect(() => {
    if (product && product.variants && product.variants.length > 0) {
      setSelectedFlavor(product.variants[0]);
    }
  }, [product]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <CommonBreadcrumb title="Product Detail" parent="Physical" />
      <Container fluid>
        <Card>
          <CardBody>
            <Row className="product-page-main">
              <ProductDetailSlider product={product} selectedFlavor={selectedFlavor} setSelectedFlavor={setSelectedFlavor} />
              <ProductInformation product={product} selectedFlavor={selectedFlavor} setSelectedFlavor={setSelectedFlavor} />
            </Row>
          </CardBody>
        </Card>
      </Container>
    </>
  );
};

export default ProductDetail;