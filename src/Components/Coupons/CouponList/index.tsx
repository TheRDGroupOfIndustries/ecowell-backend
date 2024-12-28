"use client";

import { Fragment, useEffect, useState, useCallback } from "react";
import { Card, CardBody, Col, Container, Row, Button } from "reactstrap";
import { toast } from "react-toastify";
import CommonBreadcrumb from "@/CommonComponents/CommonBreadcrumb";
import CommonCardHeader from "@/CommonComponents/CommonCardHeader";
import Datatable from "@/CommonComponents/DataTable";
import { CouponsListData } from "@/Data/Coupons";

export interface CouponsValues {
  _id: string;
  admin_id: string;

  name: string;
  code: string;
  description: string;
  startDate: Date;
  endDate: Date;
  discountType: "Percent" | "Fixed" | string;
  discountValue: number;
  quantity: number;
  freeShipping: boolean;
  status: boolean;

  productName: string;
  category: string;
  minSpend: number;
  maxSpend: number;

  perLimit: number;
  perCustomer: number;
}

const ListCoupons = () => {
  const [coupons, setCoupons] = useState<CouponsValues[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [isNoCoupons, setNoCoupons] = useState(false);
  const [filter, setFilter] = useState<"all" | "valid" | "invalid">("all");
  const [selectedCoupons, setSelectedCoupons] = useState<string[]>([]);
  console.log(selectedCoupons);

  useEffect(() => {
    const fetchAllCoupons = async () => {
      try {
        const res = await fetch("/api/coupons");

        if (!res.ok) {
          console.log(res);
        }
        const list = await res.json();

        // console.log(list);
        if (list.status === 404) setNoCoupons(true);

        setCoupons(list.coupons);
        setIsFetching(false);
      } catch (error) {
        console.log(error);
      }
    };
    fetchAllCoupons();
  }, []);

  const columns = ["code", "name", "discountValue", "discountType", "status"];

  const deleteSelectedCoupons = useCallback(async () => {
    if (selectedCoupons.length === 0) return;
    try {
      const res = await fetch("/api/coupons/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedCoupons }),
      });

      if (res.ok) {
        const { deletedCount } = await res.json();
        setCoupons((prevCoupons) =>
          prevCoupons.filter((coupon) => !selectedCoupons.includes(coupon._id))
        );
        setSelectedCoupons([]);
        toast.success(`${deletedCount} coupon(s) deleted successfully!`);
      } else {
        const { error } = await res.json();
        toast.error(error || "Failed to delete coupons.");
      }
    } catch (error) {
      console.log(error);
      toast.error("An unexpected error occurred.");
    }
  }, [selectedCoupons]);

  const handleSelectCoupon = (id: string) => {
    setSelectedCoupons((prev) =>
      prev.includes(id)
        ? prev.filter((couponId) => couponId !== id)
        : [...prev, id]
    );
  };

  const filteredCoupons =
    coupons &&
    coupons
      .filter((coupon) => {
        if (filter === "valid") return coupon.status;
        if (filter === "invalid") return !coupon.status;
        return true;
      })
      .reverse()
      .map((coupon) => {
        return {
          _id: coupon._id,
          code: coupon.code,
          name: coupon.name,
          discountValue:
            (coupon.discountType !== "percent" ? "₹" : "") +
            coupon.discountValue +
            (coupon.discountType === "percent" ? "%" : ""),
          status: (
            <span
              className={`fa fa-circle ${
                coupon.status ? "font-success" : "font-danger"
              } f-12`}
            ></span>
          ),
          checkbox: (
            <input
              type="checkbox"
              checked={selectedCoupons.includes(coupon._id)}
              onChange={() => handleSelectCoupon(coupon._id)}
            />
          ),
        };
      });

  return (
    <Fragment>
      <CommonBreadcrumb title="List Coupons" parent="coupons" />
      <Container fluid>
        <Row>
          <Col sm="12">
            <Card>
              <div className="d-flex justify-content-between align-items-center">
                <CommonCardHeader title="Coupons List"></CommonCardHeader>
                {coupons && coupons.length > 0 && (
                  <div className="filter-buttons d-flex justify-content-between align-items-center gap-2">
                    <Button
                      onClick={() => setFilter("all")}
                      className={filter === "all" ? "active" : ""}
                    >
                      All
                    </Button>
                    <Button
                      onClick={() => setFilter("valid")}
                      className={filter === "valid" ? "active" : ""}
                    >
                      Valid
                    </Button>
                    <Button
                      onClick={() => setFilter("invalid")}
                      className={filter === "invalid" ? "active" : ""}
                    >
                      Invalid
                    </Button>
                    <Button onClick={deleteSelectedCoupons} color="danger">
                      Delete Selected
                    </Button>
                  </div>
                )}
              </div>
              <CardBody>
                <div
                  id="batchDelete"
                  className="category-table order-table coupon-list-delete"
                >
                  {!isNoCoupons
                    ? filteredCoupons &&
                      filteredCoupons.length > 0 && (
                        <Datatable
                          loading={isFetching}
                          showId={false}
                          // multiSelectOption={true}
                          myData={filteredCoupons}
                          pageSize={10}
                          pagination={true}
                          class="-striped -highlight"
                          columns={[...columns, "checkbox"]}
                        />
                      )
                    : "No Coupons have been created yet!"}
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </Fragment>
  );
};

export default ListCoupons;
