import React, { useEffect, useState } from 'react';
import CommonCardHeader from "@/CommonComponents/CommonCardHeader";
import { Card, CardBody, FormGroup, Input, Label } from "reactstrap";
import MultiInputField from './MultiInputField';
import FaqInputField from './FaqInputField';
import { fetchCategories } from '@/lib/utils';


const GeneralForm = ({ generalFormState, handleGeneralForm }: {
  generalFormState: {
    price: number,
    salePrice: number,
    discount: number,
    directions: string[],
    ingredients: string[],
    benefits: string[],
    faqs: { question: string; answer: string }[],
    title: string,
    description: string,
    category: { title: string, slug: string },
    brand: string,
    // sell_on_google_quantity: number,
    isNew: boolean,
    bestBefore: string,
  },
  handleGeneralForm: (field: string, value: any) => void
}) => {
  const { price, salePrice, discount, directions, ingredients, benefits, faqs, title, description, category, brand, isNew, bestBefore } = generalFormState;
  useEffect(() => {
    console.log("bestBefore:", bestBefore);
  }, [bestBefore]);
  // const categories = [
  //   { title: "Fitness", slug: "fitness" },
  //   { title: "Health", slug: "health" },
  //   { title: "Beauty", slug: "beauty" },
  // ];
  const [categories, setCategories] = useState<{ title: string, slug: string }[]>([]);
  useEffect(() => {
    if (price > 0 && salePrice > 0) {
      const calculatedDiscount = ((price - salePrice) / price) * 100;
      handleGeneralForm('discount', calculatedDiscount);
    } else {
      handleGeneralForm('discount', 0);
    }
  }, [price, salePrice]);

  useEffect(() => {
    const fetchCategoriesData = async () => {
      try {
        const fetchedCategories = await fetchCategories();
        setCategories(fetchedCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategoriesData();
  }, []);
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCategory = categories.find(cat => cat.slug === e.target.value);
    handleGeneralForm('category', selectedCategory);
  };

  return (
    <Card>
      <CommonCardHeader title="General" />
      <CardBody className='mt-0 pt-0'>
        <div className="digital-add needs-validation">
          <FormGroup>
            <Label className="col-form-label pt-0">
              <span>*</span> Title
            </Label>
            <Input
              id="title"
              type="text"
              value={title}
              onChange={(e) => handleGeneralForm('title', e.target.value)}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label className="col-form-label pt-0">
              <span>*</span> Description
            </Label>
            <textarea
              id="description"
              rows={4}
              cols={12}
              value={description}
              onChange={(e) => handleGeneralForm('description', e.target.value)}
              required
            ></textarea>
          </FormGroup>
          <FormGroup>
            <Label className="col-form-label pt-0">
              <span>*</span> Category
            </Label>
            <select
              id="category"
              className="form-select"
              value={category?.slug || ""}
              onChange={handleCategoryChange}
              required
            >
              <option value="">--Select--</option>
              {categories.map(cat => (
                <option key={cat.slug} value={cat.slug}>{cat.title}</option>
              ))}
            </select>
          </FormGroup>
          <FormGroup>
            <Label className="col-form-label pt-0">
              <span>*</span> Brand
            </Label>
            <Input
              id="brand"
              type="text"
              value={brand}
              onChange={(e) => handleGeneralForm('brand', e.target.value)}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label className="col-form-label pt-0">
              <span>*</span> Product Price
            </Label>
            <Input
              id="price"
              type="number"
              value={price}
              onChange={(e) => {
                if (Number(e.target.value) >= 0) handleGeneralForm('price', parseFloat(e.target.value))
                // handleGeneralForm('price', parseFloat(e.target.value))
              }}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label className="col-form-label pt-0">
              <span>*</span> Sale Price
            </Label>
            <Input
              id="salePrice"
              type="number"
              value={salePrice}
              onChange={(e) => {
                if (Number(e.target.value) < price && Number(e.target.value) >= 0) handleGeneralForm('salePrice', parseFloat(e.target.value));
              }}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label className="col-form-label pt-0">Discount</Label>
            <Input id="discount" type="number" value={discount.toFixed(2)} disabled />
          </FormGroup>
          {/* <FormGroup>
            <Label className="col-form-label pt-0">
              <span>*</span> Sell on Google Quantity
            </Label>
            <Input
              id="sell_on_google_quantity"
              type="number"
              value={sell_on_google_quantity}
              onChange={(e) => handleGeneralForm('sell_on_google_quantity', parseFloat(e.target.value))}
              required
            />
          </FormGroup> */}
          <FormGroup>
            <Label className="col-form-label pt-0">Is New</Label>
            <div className="m-checkbox-inline mb-0 custom-radio-ml d-flex radio-animated">
              <Label className="d-block">
                <Input
                  className="radio_animated"
                  id="isNew-yes"
                  type="radio"
                  name="isNew"
                  value="true"
                  checked={isNew === true}
                  onChange={() => handleGeneralForm('isNew', true)}
                />
                Yes
              </Label>
              <Label className="d-block">
                <Input
                  className="radio_animated"
                  id="isNew-no"
                  type="radio"
                  name="isNew"
                  value="false"
                  checked={isNew === false}
                  onChange={() => handleGeneralForm('isNew', false)}
                />
                No
              </Label>
            </div>
          </FormGroup>
          <FormGroup>
            <Label className="col-form-label pt-0">Best Before</Label>
            <Input
              id="bestBefore"
              type="date"
              value={bestBefore}
              onChange={(e) => {
                handleGeneralForm('bestBefore', e.target.value)}}
            />
          </FormGroup>
          <MultiInputField label="Directions" items={directions} handleArrayChange={handleGeneralForm} fieldName='directions' />
          <MultiInputField label="Ingredients" items={ingredients} handleArrayChange={handleGeneralForm} fieldName='ingredients' />
          <MultiInputField label="Benefits" items={benefits} handleArrayChange={handleGeneralForm} fieldName='benefits' />
          <FaqInputField label="FAQs" faqs={faqs} handleChange={handleGeneralForm} />
        </div>
      </CardBody>
    </Card>
  );
};

export default GeneralForm;