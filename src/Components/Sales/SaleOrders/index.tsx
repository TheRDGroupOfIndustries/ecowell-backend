"use client";

import { Fragment, useEffect, useState } from "react";
import { capitalizeHeader, formatTimestamp } from "@/lib/utils";
import { Badge, Card, CardBody, Col, Container, Row } from "reactstrap";
import CommonBreadcrumb from "@/CommonComponents/CommonBreadcrumb";
import CommonCardHeader from "@/CommonComponents/CommonCardHeader";
import Datatable from "@/CommonComponents/DataTable";
// import { sampleOrders } from "@/Data/Order";
import { OrderValues } from "@/Types/Layout";
// import { SaleOrdersData } from "@/Data/Sales";

const SalesOrders = () => {
  const [orders, setOrders] = useState<OrderValues[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch("/api/order/get", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        const data = await response.json();
        // console.log(data);

        setOrders(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchOrder();
  }, []);

  // console.log(orders[0]?._id);

  const coloumns = [
    "order_id",
    "user",
    "products",
    "total_price",
    "order_date",
    "status",
  ];

  const [orderStatuses, setOrderStatuses] = useState<{ [key: string]: string }>(
    {}
  );
  const [isEditing, setIsEditing] = useState<string>("");

  const updateOrderStatus = async (
    user_id: string,
    order_id: string,
    new_status: string
  ): Promise<boolean> => {
    try {
      const response = await fetch(`/api/order/update/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id,
          order_id,
          updated_status: new_status,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update order status");
      }

      const updatedOrder = await response.json();
      // console.log("Order status updated successfully:", updatedOrder);
      return true;
    } catch (error) {
      console.error("Error updating order status:", error);
      return false;
    }
  };

  const allOrders =
    orders &&
    orders
      ?.flatMap((user) =>
        user?.orders?.map((order) => {
          const orderId = order.order_info.order_id;
          const userId = user?.user_id;
          const status = orderStatuses[orderId] || order?.order_info?.status;

          const statusColor = {
            pending: "warning",
            processing: "secondary",
            shipped: "primary",
            delivered: "success",
            cancelled: "danger",
          }[status];

          return {
            order_id: orderId,
            user: user.user_name,
            products: order.products.length.toString(),
            total_price: "₹" + order.order_info.total_price,
            order_date: formatTimestamp(order.order_info.order_date.toString()),
            status: (
              <div style={{ position: "relative", userSelect: "none" }}>
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {isEditing === orderId ? (
                    <div
                      style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <select
                        value={orderStatuses[orderId] || status}
                        onChange={async (e) => {
                          const newStatus = e.target.value;
                          // calling the API to update the status in the database
                          const isUpdated = await updateOrderStatus(
                            userId.toString(),
                            orderId.toString(),
                            newStatus
                          );

                          if (isUpdated) {
                            setOrderStatuses((prev) => ({
                              ...prev,
                              [orderId]: newStatus,
                            }));
                          }
                          setIsEditing("");
                        }}
                        style={{
                          width: "100%",
                          cursor: "pointer",
                          marginRight: "5px",
                          padding: "5px 10px",
                          borderRadius: "8px",
                          border: "1px solid #ccc",
                          boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                          transition: "border-color 0.3s, box-shadow 0.3s",
                          color:
                            {
                              pending: "orange",
                              processing: "blue",
                              shipped: "green",
                              delivered: "darkgreen",
                              cancelled: "red",
                            }[orderStatuses[orderId] || status] || "white",
                        }}
                      >
                        <option
                          value="pending"
                          style={{ color: "white", backgroundColor: "orange" }}
                        >
                          Pending
                        </option>
                        <option
                          value="processing"
                          style={{ color: "white", backgroundColor: "blue" }}
                        >
                          Processing
                        </option>
                        <option
                          value="shipped"
                          style={{ color: "white", backgroundColor: "green" }}
                        >
                          Shipped
                        </option>
                        <option
                          value="delivered"
                          style={{
                            color: "white",
                            backgroundColor: "darkgreen",
                          }}
                        >
                          Delivered
                        </option>
                        <option
                          value="cancelled"
                          style={{ color: "white", backgroundColor: "red" }}
                        >
                          Cancelled
                        </option>
                      </select>
                      <span
                        onClick={() => setIsEditing("")}
                        title="Cancel"
                        style={{
                          color: "red",
                          fontSize: "20px",
                          cursor: "pointer",
                        }}
                      >
                        X
                      </span>
                    </div>
                  ) : (
                    <div
                      title="Update Status"
                      onClick={() => setIsEditing(orderId)}
                      style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                      }}
                    >
                      <Badge
                        title={capitalizeHeader(status)}
                        color={statusColor}
                        style={{
                          width: "100%",
                          cursor: "pointer",
                          marginRight: "5px",
                        }}
                      >
                        {capitalizeHeader(status)}
                      </Badge>
                      <i className="fa fa-pencil"></i>
                    </div>
                  )}
                </div>
              </div>
            ),
          };
        })
      )
      .sort(
        (a, b) =>
          new Date(b.order_date).getTime() - new Date(a.order_date).getTime()
      );

  return (
    <Fragment>
      <CommonBreadcrumb title="orders" parent="sales" />
      <Container fluid>
        <Row>
          <Col sm="12">
            <Card>
              <CommonCardHeader title="Manage Order" />
              <CardBody className="order-datatable">
                <Datatable
                  loading={loading}
                  multiSelectOption={false}
                  myData={allOrders}
                  pageSize={10}
                  pagination={true}
                  class="-striped -highlight"
                />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </Fragment>
  );
};
export default SalesOrders;
