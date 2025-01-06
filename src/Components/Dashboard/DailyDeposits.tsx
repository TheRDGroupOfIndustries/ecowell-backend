import { DailyDepositOptions, DailyDepositsData } from "@/Data/Dashboard";
import { Calendar } from "react-feather";
import Chart from "react-google-charts";
import { Card, CardBody, CardHeader, Col, Media, Row } from "reactstrap";

const DailyDeposits = () => {
  return (
    <Col xl="3 xl-50" md="6">
      <Card className="order-graph sales-carousel">
        <CardHeader>
          <h6>Daily Revenue</h6>
          <Row>
            <Col className="col-6">
              <div className="small-chartjs">
                <div
                  className="flot-chart-placeholder"
                  id="simple-line-chart-sparkline-1"
                >
                  <Chart
                    height={"60px"}
                    chartType="LineChart"
                    loader={<div>Loading Chart</div>}
                    data={DailyDepositsData}
                    options={DailyDepositOptions}
                    legend_toggle
                  />
                </div>
              </div>
            </Col>
            <Col className="col-6">
              <div className="value-graph">
                <h3>
                  75%{" "}
                  <span>
                    <i className="fa fa-angle-up font-danger"></i>
                  </span>
                </h3>
              </div>
            </Col>
          </Row>
        </CardHeader>
        <CardBody>
          <Media>
            <Media body>
              <span>Daily Sales Value</span>
              <h2 className="mb-0">2782</h2>
              <p>
                0.45%
                <span>
                  <i className="fa fa-angle-up"></i>
                </span>
              </p>
              <h5 className="f-w-600 f-16">Today's Performance</h5>
              <p>
                Daily revenue tracking shows consistent growth in supplement
                sales and subscriptions
              </p>
            </Media>
            <div className="bg-danger b-r-8">
              <div className="small-box">
                <Calendar />
              </div>
            </div>
          </Media>
        </CardBody>
      </Card>
    </Col>
  );
};

export default DailyDeposits;
