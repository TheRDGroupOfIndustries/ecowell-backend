import { TotalSalesData, TotalSalesOptions } from "@/Data/Dashboard";
import { Briefcase } from "react-feather";
import Chart from "react-google-charts";
import { Card, CardBody, CardHeader, Col, Media, Row } from "reactstrap";

const TotalSales = () => {
  return (
    <Col xl="3 xl-50" md="6">
      <Card className=" order-graph sales-carousel">
        <CardHeader>
          <h6>Total Supplement Sales</h6>
          <Row>
            <Col xs="6">
              <div className="small-chartjs">
                <div
                  className="flot-chart-placeholder"
                  id="simple-line-chart-sparkline-3"
                >
                  <Chart
                    height={"60px"}
                    chartType="LineChart"
                    loader={<div>Loading Chart</div>}
                    data={TotalSalesData}
                    options={TotalSalesOptions}
                    legend_toggle
                  />
                </div>
              </div>
            </Col>
            <Col xs="6">
              <div className="value-graph">
                <h3>
                  42%
                  <span>
                    <i className="fa fa-angle-up font-primary"></i>
                  </span>
                </h3>
              </div>
            </Col>
          </Row>
        </CardHeader>
        <CardBody>
          <Media>
            <Media body>
              <span>Supplement Sales</span>
              <h2 className="mb-0">3854</h2>
              <p>
                0.85%
                <span>
                  <i className="fa fa-angle-up"></i>
                </span>
              </p>
              <h5 className="f-w-600 f-16">Monthly Revenue Analysis</h5>
              <p>
                Strong growth in premium protein supplements and wellness
                products
              </p>
            </Media>
            <div className="bg-primary b-r-8">
              <div className="small-box">
                <Briefcase />
              </div>
            </div>
          </Media>
        </CardBody>
      </Card>
    </Col>
  );
};

export default TotalSales;
