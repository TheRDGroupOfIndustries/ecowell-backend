"use client";

import { FC } from "react";
import { Col, Form, FormGroup, Input, Label, Row } from "reactstrap";
import DatePicker from "react-datepicker";
import { GeneralCouponFormDataTypes } from ".";
import "react-datepicker/dist/react-datepicker.css";

interface GeneralCouponFormProps {
  generalFormData: GeneralCouponFormDataTypes;
  setGeneralFormData: React.Dispatch<
    React.SetStateAction<GeneralCouponFormDataTypes>
  >;
}

const GeneralCouponForm: FC<GeneralCouponFormProps> = ({
  generalFormData,
  setGeneralFormData,
}) => {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setGeneralFormData({
      ...generalFormData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const generateCouponCode = () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 6; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    setGeneralFormData({ ...generalFormData, code: result });
  };

  // const validateForm = () => {
  //   const { name, code, discountType, quantity } = generalFormData;
  //   if (!name || !code || !discountType || quantity <= 0) {
  //     toast.error("Please fill in all required fields correctly.");
  //     return false;
  //   }
  //   return true;
  // };

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (validateForm()) {
  //     toast.success("Coupon created successfully!");
  //     // Handle form submission logic here
  //   }
  // };

  return (
    <Form className="needs-validation">
      <h4>General</h4>
      <Row>
        <Col sm="12">
          <FormGroup>
            <Row>
              <Col xl="3" md="4">
                <Label>
                  Name<span style={{ color: "red" }}>*</span>
                </Label>
              </Col>
              <Col md="7">
                <Input
                  name="name"
                  value={generalFormData.name}
                  onChange={handleChange}
                  type="text"
                  required
                />
              </Col>
            </Row>
          </FormGroup>
          <FormGroup>
            <Row>
              <Col xl="3" md="4">
                <Label>
                  Code<span style={{ color: "red" }}>*</span>
                </Label>
              </Col>
              <Col md="7">
                <Input
                  name="code"
                  value={generalFormData.code}
                  onChange={handleChange}
                  type="text"
                  required
                />
                <span
                  onClick={generateCouponCode}
                  style={{ cursor: "pointer", color: "blue" }}
                >
                  generate code
                </span>
              </Col>

              {/* <div className="valid-feedback">
                Please Provide a Valid Coupon Code.
              </div> */}
            </Row>
          </FormGroup>
          <FormGroup>
            <Row>
              <Col xl="3" md="4">
                <Label>Description</Label>
              </Col>
              <Col md="7">
                <Input
                  name="description"
                  value={generalFormData.description}
                  onChange={handleChange}
                  type="text"
                  required
                />
              </Col>
            </Row>
          </FormGroup>
          <FormGroup>
            <Row>
              <Col xl="3" md="4">
                <Label>
                  Start Date<span style={{ color: "red" }}>*</span>
                </Label>
              </Col>
              <Col md="7">
                <DatePicker
                  selected={generalFormData.startDate}
                  onChange={(date: Date) =>
                    setGeneralFormData({ ...generalFormData, startDate: date })
                  }
                />
              </Col>
            </Row>
          </FormGroup>
          <FormGroup>
            <Row>
              <Col xl="3" md="4">
                <Label>
                  End Date<span style={{ color: "red" }}>*</span>
                </Label>
              </Col>
              <Col md="7">
                <DatePicker
                  selected={generalFormData.endDate}
                  onChange={(date: Date) =>
                    setGeneralFormData({ ...generalFormData, endDate: date })
                  }
                />
              </Col>
            </Row>
          </FormGroup>
          <FormGroup>
            <Row>
              <Col xl="3" md="4">
                <Label>
                  Discount Type<span style={{ color: "red" }}>*</span>
                </Label>
              </Col>
              <Col md="7">
                <select
                  name="discountType"
                  value={generalFormData.discountType}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  <option value="">Select type</option>
                  <option value="percent">Percent</option>
                  <option value="fixed">Fixed</option>
                </select>
              </Col>
            </Row>
          </FormGroup>
          <FormGroup>
            <Row>
              <Col xl="3" md="4">
                <Label>
                  Discount{" "}
                  {generalFormData.discountType === "percent"
                    ? "Percent"
                    : "Fixed Amount"}
                  <span style={{ color: "red" }}>*</span>
                </Label>
              </Col>
              <Col md="7">
                <Input
                  name="discountValue"
                  value={generalFormData.discountValue}
                  onChange={handleChange}
                  type="number"
                  required
                />
              </Col>
            </Row>
          </FormGroup>
          <FormGroup>
            <Row>
              <Col xl="3" md="4">
                <Label>Quantity</Label>
              </Col>
              <Col md="7">
                <Input
                  name="quantity"
                  value={generalFormData.quantity}
                  onChange={handleChange}
                  type="number"
                  required
                />
              </Col>
            </Row>
          </FormGroup>
          <FormGroup>
            <Row>
              <Col xl="3" md="4">
                <Label>Free Shipping</Label>
              </Col>
              <Col md="7">
                <Label className="d-block">
                  <Input
                    name="freeShipping"
                    checked={generalFormData.freeShipping}
                    onChange={handleChange}
                    className="checkbox_animated"
                    type="checkbox"
                  />
                  Allow Free Shipping
                </Label>
              </Col>
            </Row>
          </FormGroup>
          <FormGroup>
            <Row>
              <Col xl="3" md="4">
                <Label>Status</Label>
              </Col>
              <Col md="7">
                <Label className="d-block">
                  <Input
                    name="status"
                    checked={generalFormData.status}
                    onChange={handleChange}
                    className="checkbox_animated"
                    type="checkbox"
                  />
                  Enable the Coupon
                </Label>
              </Col>
            </Row>
          </FormGroup>
        </Col>
      </Row>
    </Form>
  );
};

export default GeneralCouponForm;
