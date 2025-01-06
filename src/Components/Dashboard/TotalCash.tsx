import { TotalCashData, TotalCashOptions } from "@/Data/Dashboard";
import { ShoppingCart } from "react-feather";
import Chart from "react-google-charts";
import { Card, CardBody, CardHeader, Col, Media, Row } from "reactstrap";

const TotalCash = () => {
  return (
    <Col xl="3 xl-50" md="6">
      <Card className="order-graph sales-carousel">
        <CardHeader>
          <h6>Total Online Transactions</h6>
          <Row>
            <Col xs="6">
              <div className="small-chartjs">
                <div
                  className="flot-chart-placeholder"
                  id="simple-line-chart-sparkline-2"
                >
                  <Chart
                    height={"60px"}
                    chartType="LineChart"
                    loader={<div>Loading Chart</div>}
                    data={TotalCashData}
                    options={TotalCashOptions}
                    legend_toggle
                  />
                </div>
              </div>
            </Col>
            <Col xs="6">
              <div className="value-graph">
                <h3>
                  28%
                  <span>
                    <i className="fa fa-angle-up font-warning"></i>
                  </span>
                </h3>
              </div>
            </Col>
          </Row>
        </CardHeader>
        <CardBody>
          <Media>
            <Media body>
              <span>Digital Payments</span>
              <h2 className="mb-0">8472</h2>
              <p>
                1.4%
                <span>
                  <i className="fa fa-angle-up"></i>
                </span>
              </p>
              <h5 className="f-w-600 f-16">Payment Analytics</h5>
              <p>
                Digital transactions show increasing customer preference for
                online supplement purchases
              </p>
            </Media>
            <div className="bg-warning b-r-8">
              <div className="small-box">
                <ShoppingCart />
              </div>
            </div>
          </Media>
        </CardBody>
      </Card>
    </Col>
  );
};

export default TotalCash;
