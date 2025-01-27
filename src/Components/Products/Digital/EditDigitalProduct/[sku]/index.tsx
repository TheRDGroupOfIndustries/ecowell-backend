import CommonBreadcrumb from "@/CommonComponents/CommonBreadcrumb";
import { Fragment, useState, useEffect } from "react";
import {
  Col,
  Container,
  Row,
  Button,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import GeneralForm from "../../AddDigitalProduct/GeneralForm";
import VariantForm from "../../AddDigitalProduct/VariantForm";
import AdditionalInfoForm from "../../AddDigitalProduct/AdditionalForm";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import HeroBannerForm from "../../AddDigitalProduct/HeroBannerForm";
import DailyRitualForm from "../../AddDigitalProduct/DailyRitualForm";
import IngredientHighlightsForm from "../../AddDigitalProduct/IngredientHighlightsForm";
import { IngredientHighlight } from "@/Types/product";

interface Variant {
  flavor: string;
  images: string[];
  stock: number;
  form: "tablet" | "powder" | "liquid";
  netQuantity: string;
  nutritionFacts: string[];
  allergens?: string[];
  servingSize: string;
}

interface EditDigitalProductProps {
  editProductSku: string;
}

const EditDigitalProduct: React.FC<EditDigitalProductProps> = ({
  editProductSku,
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isPosting, setIsPosting] = useState(false);
  const [initialState, setInitialState] = useState<any>(null);
  const [hasChanges, setHasChanges] = useState(false);
  // General Form
  const [generalFormState, setGeneralFormState] = useState({
    price: 0,
    salePrice: 0,
    discount: 0,
    directions: [] as string[],
    ingredients: [] as string[],
    benefits: [] as string[],
    faqs: [] as { question: string; answer: string }[],
    title: "",
    description: "",
    category: {
      title: "",
      slug: "",
    },
    brand: "",
    isNew: false,
    isSingleVariantProduct: false,
    bestBefore: "",
    sku: "", // Add this line
    // new fields
    heroBanner: {
      title: "",
      subtitle: "",
      description: "",
      backgroundImage: "",
    },
    dailyRitual: {
      title: "",
      description: "",
      lifestyleImage: "",
    },
    ingredientHighlights: [] as IngredientHighlight[],
  });

  const handleGeneralForm = (field: string, value: any) => {
    setGeneralFormState((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  // Variant Form
  const [variants, setVariants] = useState<Variant[]>([]);
  const [newVariant, setNewVariant] = useState<Variant>({
    flavor: "",
    images: [],
    stock: 0,
    form: "tablet",
    netQuantity: "0",
    nutritionFacts: [],
    allergens: [],
    servingSize: "",
  });
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: boolean }>({});
  const [isUploading, setIsUploading] = useState(false);

  const variantFormProps = {
    variants,
    setVariants,
    newVariant,
    setNewVariant,
    imagePreviews,
    setImagePreviews,
    errors,
    setErrors,
    isUploading,
    setIsUploading,
  };

  const [additionalInfoStates, setAdditionalInfoStates] = useState({
    manufacturedBy: "",
    countryOfOrigin: "",
    phone: "",
    email: "",
  });

  const handleAdditionalChange = (field: string, value: any) => {
    setAdditionalInfoStates((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const handleVariantChange = (name: string, value: any) => {
    setNewVariant({
      ...newVariant,
      [name]: value,
    });
  };

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/products/get/${editProductSku}`);
        const product = response.data;
        // console.log("Product:", product);
        //convert bestBefore to date in format bestBefore: 2024-11-13
        let bestBeforeTemp = new Date(product.bestBefore)
          .toISOString()
          .split("T")[0];

        const initialData = {
          generalForm: {
            price: product.price,
            salePrice: product.salePrice,
            discount: product.discount || 0,
            directions: product.directions,
            ingredients: product.ingredients,
            benefits: product.benefits,
            faqs: product.faqs,
            title: product.title,
            description: product.description,
            category: product.category,
            brand: product.brand,
            isNew: product.isNew || false,
            bestBefore: bestBeforeTemp,
            isSingleVariantProduct: product?.isSingleVariantProduct,
            sku: product.sku || editProductSku, // Add this line
            heroBanner: product.heroBanner,
            dailyRitual: product.dailyRitual,
            ingredientHighlights: product.ingredientHighlights,
          },
          variants: product.variants,
          additionalInfo: product.additionalInfo,
        };

        setInitialState(initialData);

        setGeneralFormState({
          price: product.price,
          salePrice: product.salePrice,
          discount: product.discount || 0,
          directions: product.directions,
          ingredients: product.ingredients,
          benefits: product.benefits,
          faqs: product.faqs,
          title: product.title,
          description: product.description,
          category: product.category,
          brand: product.brand,
          isNew: product.isNew || false,
          bestBefore: bestBeforeTemp,
          isSingleVariantProduct: product?.isSingleVariantProduct,
          sku: product.sku || editProductSku, // Add this line
          heroBanner: product.heroBanner,
          dailyRitual: product.dailyRitual,
          ingredientHighlights: product.ingredientHighlights,
        });
        setVariants(product.variants);
        setAdditionalInfoStates(product.additionalInfo);
      } catch (error) {
        console.error("Error fetching product details:", error);
        toast.error("Failed to fetch product details");
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [editProductSku]);

  useEffect(() => {
    if (initialState) {
      const currentState = {
        generalForm: generalFormState,
        variants: variants,
        additionalInfo: additionalInfoStates,
      };

      const hasStateChanged =
        JSON.stringify(currentState) !== JSON.stringify(initialState);
      setHasChanges(hasStateChanged);
    }
  }, [generalFormState, variants, additionalInfoStates, initialState]);

  const handleUpdate = async () => {
    // Validate required fields
    const requiredFields = [
      "title",
      "description",
      "category.title",
      "category.slug",
      "brand",
      "price",
      "bestBefore",
      "sku", // Add this line
    ];
    const missingFields = requiredFields.filter((field) => {
      const keys = field.split(".");
      let value: any = generalFormState;
      keys.forEach((key: string) => {
        value = value[key as keyof typeof value];
      });
      return !value;
    });

    if (missingFields.length > 0) {
      toast.error(
        "Please fill these required fields: " + missingFields.join(", ")
      );
      return;
    }

    if (variants.length === 0) {
      toast.error("Please add at least one variant.");
      return;
    }

    setIsPosting(true);

    const product = {
      ...generalFormState,
      variants: variants,
      additionalInfo: additionalInfoStates,
      oldSku: editProductSku, // Add this line to track the original SKU
    };

    try {
      const response = await axios.put(
        `/api/products/put/${editProductSku}`,
        product
      );

      if (!response.data.success) {
        toast.error(response.data.error || "Failed to update product");
        return;
      }

      // Show the specific success message from the API
      toast.success(response.data.message || "Product updated successfully");

      if (response.data.skuUpdated) {
        router.push(
          `/en/products/digital/digital-edit-product/${generalFormState.sku}`
        );
      } else {
        router.push("/en/products/digital/digital-product-list");
      }
    } catch (error: any) {
      console.error("Error updating product:", error);
      const errorMessage =
        error.response?.data?.error || "Failed to update product";
      toast.error(errorMessage);
    } finally {
      setIsPosting(false);
    }
  };

  const handleCancel = () => {
    // Redirect to product list
    router.push("/en/products/digital/digital-product-list");
  };

  if (loading) return <div>Loading...</div>;

  return (
    <Fragment>
      <CommonBreadcrumb
        title="Edit Product"
        parent="products/digital"
        element={
          <div className="d-flex gap-2 justify-content-end ">
            <button
              onClick={handleUpdate}
              className="btn btn-primary"
              disabled={isPosting || !hasChanges}
              style={{ cursor: isPosting || !hasChanges ? "not-allowed" : "" }}
            >
              {isPosting ? "Updating..." : "Update"}
            </button>
            <button onClick={handleCancel} className="btn btn-secondary">
              Cancel
            </button>
          </div>
        }
      />
      <Container fluid>
        <Row className="product-adding">
          <Col xl="6">
            <GeneralForm
              isEdit={true}
              generalFormState={generalFormState}
              handleGeneralForm={handleGeneralForm}
            />
          </Col>
          <Col xl="6">
            <div className="card mb-3">
              <div className="card-body">
                <FormGroup>
                  <Label className="col-form-label pt-0">
                    Single Variant Product
                  </Label>
                  <div className="m-checkbox-inline mb-0 custom-radio-ml d-flex gap-4 radio-animated">
                    <Label className="d-block">
                      <Input
                        className="radio_animated"
                        id="isSingleVariant-yes"
                        type="radio"
                        name="isSingleVariantProduct"
                        value="true"
                        checked={
                          generalFormState.isSingleVariantProduct === true
                        }
                        onChange={() =>
                          handleGeneralForm("isSingleVariantProduct", true)
                        }
                      />
                      Yes
                    </Label>
                    <Label className="d-block">
                      <Input
                        className="radio_animated"
                        id="isSingleVariant-no"
                        type="radio"
                        name="isSingleVariantProduct"
                        value="false"
                        checked={
                          generalFormState.isSingleVariantProduct === false
                        }
                        onChange={() =>
                          handleGeneralForm("isSingleVariantProduct", false)
                        }
                      />
                      No
                    </Label>
                  </div>
                </FormGroup>
              </div>
            </div>
            <VariantForm
              isSingleVariantProduct={generalFormState.isSingleVariantProduct}
              variantProps={variantFormProps}
              handleVariantChange={handleVariantChange}
            />
            <AdditionalInfoForm
              additionalInfoStates={additionalInfoStates}
              handleAdditionalChange={handleAdditionalChange}
            />
            {/* <MetaDataForm /> */}
          </Col>
          <HeroBannerForm
            heroBanner={generalFormState.heroBanner}
            onUpdate={(data) => handleGeneralForm("heroBanner", data)}
          />

          <DailyRitualForm
            dailyRitual={generalFormState.dailyRitual}
            onUpdate={(data) => handleGeneralForm("dailyRitual", data)}
          />

          <IngredientHighlightsForm
            ingredientHighlights={generalFormState.ingredientHighlights}
            onUpdate={(data) => handleGeneralForm("ingredientHighlights", data)}
          />
        </Row>
      </Container>
    </Fragment>
  );
};

export default EditDigitalProduct;
