import Image from "next/image";
import Slider from "react-slick";
import { Card, Col } from "reactstrap";
import stats from "../../../public/assets/images/dashboard/stats.png";

const LoginSlider = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    arrows: false,
  };
  return (
    <Col md="5" className="p-0 card-left">
      <Card className="bg-primary">
        <div className="svg-icon">
          <Image
            height={80}
            width={80}
            alt="Ecowell Logo"
            src="/logo.png"
            className="Img-fluid"
          />
        </div>
        <Slider className="single-item" {...settings}>
          {[
            {
              title: "Welcome to Ecowell",
              description:
                "Manage your eco-friendly products, orders, and inventory all in one place.",
            },
            {
              title: "Powerful Analytics",
              description:
                "Track sales performance, customer behavior, and sustainable product trends with ease.",
            },
            {
              title: "Streamlined Operations",
              description:
                "Handle shipping, returns, and customer support efficiently while promoting environmental responsibility.",
            },
          ].map((slide, i) => (
            <div key={i}>
              <div>
                <h3>{slide.title}</h3>
                <p>{slide.description}</p>
              </div>
            </div>
          ))}
        </Slider>
      </Card>
    </Col>
  );
};

export default LoginSlider;
