import React from 'react';
import { Card, CardBody, FormGroup, Input, Label } from 'reactstrap';
import CommonCardHeader from "@/CommonComponents/CommonCardHeader";

const AdditionalInfoForm = ({ additionalInfoStates, handleAdditionalChange }: {
  additionalInfoStates: {
    manufacturedBy: string;
    countryOfOrigin: string;
    phone: string;
    email: string;
  };
  handleAdditionalChange: (field: string, value: any) => void;
}) => {
  const { manufacturedBy, countryOfOrigin, phone, email } = additionalInfoStates;

  return (
    <Card>
      <CommonCardHeader title="Additional Information" />
      <CardBody className='mt-0 pt-0'>
        <div className="digital-add needs-validation">
          <FormGroup>
            <Label className="col-form-label pt-0">
              Manufactured By
            </Label>
            <Input
              id="manufacturedBy"
              type="text"
              value={manufacturedBy}
              onChange={(e) => handleAdditionalChange('manufacturedBy', e.target.value)}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label className="col-form-label pt-0">
             Country of Origin
            </Label>
            <Input
              id="countryOfOrigin"
              type="text"
              value={countryOfOrigin}
              onChange={(e) => handleAdditionalChange('countryOfOrigin', e.target.value)}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label className="col-form-label pt-0">
               Phone
            </Label>
            <Input
              id="phone"
              type="text"
              value={phone}
              onChange={(e) => handleAdditionalChange('phone', e.target.value)}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label className="col-form-label pt-0">
         Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => handleAdditionalChange('email', e.target.value)}
              required
            />
          </FormGroup>
        </div>
      </CardBody>
    </Card>
  );
};

export default AdditionalInfoForm;