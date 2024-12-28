"use client";

import { Col, Form, FormGroup, Input, Label, Row } from "reactstrap";
import { UsageCouponFormDataTypes } from ".";
import { FC } from "react";

interface UsageCouponFormProps {
  usageFormData: UsageCouponFormDataTypes;
  setUsageFormData: React.Dispatch<
    React.SetStateAction<UsageCouponFormDataTypes>
  >;
}

const UsageCouponForm: FC<UsageCouponFormProps> = ({
  usageFormData,
  setUsageFormData,
}) => {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setUsageFormData({
      ...usageFormData,
      [name]: value,
    });
  };
  return (
    <Form className="needs-validation" noValidate>
      <h4>Usage Limits</h4>
      <FormGroup>
        <Row>
          <Col xl="3" md="4">
            <Label>Per Limit</Label>
          </Col>
          <Col md="7">
            <Input
              id="validationCustom6"
              type="number"
              name="perLimit"
              value={usageFormData.perLimit}
              onChange={handleChange}
            />
          </Col>
        </Row>
      </FormGroup>
      <FormGroup>
        <Row>
          <Col xl="3" md="4">
            <Label>Per Customer</Label>
          </Col>
          <Col md="7">
            <Input
              id="validationCustom7"
              type="number"
              name="perCustomer"
              value={usageFormData.perCustomer}
              onChange={handleChange}
            />
          </Col>
        </Row>
      </FormGroup>
    </Form>
  );
};

export default UsageCouponForm;
