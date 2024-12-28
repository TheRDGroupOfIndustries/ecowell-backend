import { useEffect, useRef, useState } from "react";
import Slider from "react-slick";
import { Col } from "reactstrap";

const ProductDetailSlider = ({ product, selectedFlavor, setSelectedFlavor }: any) => {
  const slider1Ref = useRef<Slider | null>(null);
  const slider2Ref = useRef<Slider | null>(null);
  

  useEffect(() => {
    if (product && product.variants && product.variants.length > 0) {
      setSelectedFlavor(product.variants[0]);
    }
  }, [product]);

  useEffect(() => {
    if (slider1Ref.current && slider2Ref.current) {
      slider1Ref.current.slickGoTo(0);
      slider2Ref.current.slickGoTo(0);
    }
  }, [selectedFlavor]);

  if (!selectedFlavor) {
    return <div>Loading...</div>;
  }

  return (
    <Col xl="4">
      <Slider
        asNavFor={slider2Ref.current ?? undefined}
        ref={slider1Ref}
        className="product-slider no-arrow"
        beforeChange={(oldIndex, newIndex) => {
          if (slider2Ref.current) {
            slider2Ref.current.slickGoTo(newIndex);
          }
        }}
      >
        {selectedFlavor.images.map((img: string, index: number) => (
          <div key={index} className="item">
            <img className="img-fluid" src={img} alt={`Flavor Image ${index + 1}`} />
          </div>
        ))}
      </Slider>
      <Slider
        asNavFor={slider1Ref.current ?? undefined}
        ref={slider2Ref}
        slidesToShow={selectedFlavor.images.length}
        swipeToSlide
        focusOnSelect
        className="small-slick"
        beforeChange={(oldIndex, newIndex) => {
          if (slider1Ref.current) {
            slider1Ref.current.slickGoTo(newIndex);
          }
        }}
      >
        {selectedFlavor.images.map((img: string, index: number) => (
          <div key={index} className="item" style={{
            width: "fit-content!important",
          }}>
            <img className="img-fluid"
            style={{
              height: "150px",
              width: "200px",
              objectFit: "cover",
              objectPosition: "top",
            }}
             src={img} alt={`Flavor Thumbnail ${index + 1}`} />
          </div>
        ))}
      </Slider>
    </Col>
  );
};

export default ProductDetailSlider;