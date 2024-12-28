"use client";

import { FC } from "react";
import { Col, Form, FormGroup, Input, Label, Row } from "reactstrap";
import { RestrictionCouponFormDataTypes } from ".";

interface RestrictionFormProps {
  restrictionFormData: RestrictionCouponFormDataTypes;
  setRestrictionFormData: React.Dispatch<
    React.SetStateAction<RestrictionCouponFormDataTypes>
  >;
}

const RestrictionCouponForm: FC<RestrictionFormProps> = ({
  restrictionFormData,
  setRestrictionFormData,
}) => {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setRestrictionFormData({
      ...restrictionFormData,
      [name]: value,
    });
  };

  return (
    <Form className="needs-validation" noValidate>
      <h4>Restriction</h4>
      <FormGroup>
        <Row>
          <Col xl="3" md="4">
            <Label>Products</Label>
          </Col>
          <Col md="7">
            <Input
              id="validationCustom3"
              type="text"
              name="productName"
              value={restrictionFormData.productName}
              onChange={handleChange}
              required
            />
          </Col>
          <div className="valid-feedback">Please Provide a Product Name.</div>
        </Row>
      </FormGroup>
      <FormGroup>
        <Row>
          <Col xl="3" md="4">
            <Label>Category</Label>
          </Col>
          <Col md="7">
            <select
              className="form-select"
              name="category"
              value={restrictionFormData.category}
              onChange={handleChange}
              required
            >
              <option>Select category</option>
              <option value="electronics">Electronics</option>
              <option value="clothes">Clothes</option>
              <option value="shoes">Shoes</option>
              <option value="digital">Digital</option>
            </select>
          </Col>
        </Row>
      </FormGroup>
      <FormGroup>
        <Row>
          <Col xl="3" md="4">
            <Label>Minimum Spend</Label>
          </Col>
          <Col md="7">
            <Input
              id="validationCustom4"
              type="number"
              name="minSpend"
              value={restrictionFormData.minSpend}
              onChange={handleChange}
            />
          </Col>
        </Row>
      </FormGroup>
      <FormGroup>
        <Row>
          <Col xl="3" md="4">
            <Label>Maximum Spend</Label>
          </Col>
          <Col md="7">
            <Input
              id="validationCustom5"
              type="number"
              name="maxSpend"
              value={restrictionFormData.maxSpend}
              onChange={handleChange}
            />
          </Col>
        </Row>
      </FormGroup>
    </Form>
  );
};

export default RestrictionCouponForm;
