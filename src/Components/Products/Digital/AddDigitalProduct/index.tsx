import CommonBreadcrumb from "@/CommonComponents/CommonBreadcrumb";
import { Fragment, useState } from "react";
import {
  Button,
  Col,
  Container,
  FormGroup,
  Input,
  Label,
  Row,
} from "reactstrap";
import GeneralForm from "./GeneralForm";
import MetaDataForm from "./MetaDataForm";
import VariantForm from "./VariantForm";
import AdditionalInfoForm from "./AdditionalForm";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { uploadNewFile } from "@/lib/actions/fileUploads";
import Image from "next/image";
import { AiOutlineDelete } from "react-icons/ai";

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

interface IngredientHighlight {
  name: string;
  description: string;
  image: string;
}

const AddDigitalProduct = () => {
  const router = useRouter();

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
    bestBefore: "",
    sell_on_google_quantity: 0,
    isSingleVariantProduct: false,

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
    netQuantity: "",
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
    manufacturedBy: "Ecowell",
    countryOfOrigin: "India",
    phone: "7065937377",
    email: "contact@ecowellonline.com",
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

  const [isPosting, setIsPosting] = useState(false);

  const [uploadingStates, setUploadingStates] = useState({
    heroBanner: false,
    dailyRitual: false,
    ingredients: new Array(3).fill(false),
  });

  const handleSave = async () => {
    // Validate required fields
    const requiredFields = [
      "title",
      "description",
      "category.title",
      "category.slug",
      "brand",
      "price",
      // Remove "sell_on_google_quantity" as it's calculated from variants

      // new fields - make them optional by removing them from required fields
      // "heroBanner.title",
      // "heroBanner.subtitle",
      // "heroBanner.description",
      // "heroBanner.backgroundImage",
      // "dailyRitual.title",
      // "dailyRitual.description",
      // "dailyRitual.lifestyleImage",
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
    if (generalFormState.price <= 0 || generalFormState.salePrice <= 0) {
      toast.error("Price and sale price must be greater than 0.");
      return;
    }

    if (generalFormState.price <= generalFormState.salePrice) {
      toast.error("Sale price must be less than the price.");
      return;
    }

    setIsPosting(true);

    const product = {
      ...generalFormState,
      variants: variants,
      additionalInfo: {
        manufacturedBy: additionalInfoStates.manufacturedBy || " ",
        countryOfOrigin: additionalInfoStates.countryOfOrigin || " ",
        phone: additionalInfoStates.phone || " ",
        email: additionalInfoStates.email || " ",
      },
      sku: "some-sku-value", // Add a valid SKU value
      ratings: 0, // Default value
      reviews_number: 0, // Default value
    };

    try {
      const response = await axios.post(
        "/api/products/create/create-single",
        product
      );
      console.log(response.data);
      toast.success("Product created successfully");
      // Reset all fields
      setGeneralFormState({
        price: 0,
        salePrice: 0,
        discount: 0,
        directions: [],
        ingredients: [],
        benefits: [],
        faqs: [],
        title: "",
        description: "",
        category: {
          title: "",
          slug: "",
        },
        brand: "",
        isNew: false,
        bestBefore: "",
        sell_on_google_quantity: 0,
        isSingleVariantProduct: false,

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
        ingredientHighlights: [],
      });
      setVariants([]);
      setAdditionalInfoStates({
        manufacturedBy: "",
        countryOfOrigin: "",
        phone: "",
        email: "",
      });
      // Redirect to product list
      router.push("/en/products/digital/digital-product-list");
    } catch (error) {
      console.error("Error creating product:", error);
      toast.error("Failed to create product");
    } finally {
      setIsPosting(false);
    }
  };

  const handleCancel = () => {
    // Reset all fields
    setGeneralFormState({
      price: 0,
      salePrice: 0,
      discount: 0,
      directions: [],
      ingredients: [],
      benefits: [],
      faqs: [],
      title: "",
      description: "",
      category: {
        title: "",
        slug: "",
      },
      brand: "",
      isNew: false,
      bestBefore: "",
      sell_on_google_quantity: 0,
      isSingleVariantProduct: false,

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
      ingredientHighlights: [],
    });
    setVariants([]);
    setAdditionalInfoStates({
      manufacturedBy: "",
      countryOfOrigin: "",
      phone: "",
      email: "",
    });
    // Redirect to home page
    router.push("/");
  };

  const handleImageUpload = async (
    callback: (imageUrl: string) => void,
    section: "heroBanner" | "dailyRitual" | "ingredient",
    index?: number
  ) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*, .gif";
    input.multiple = false;

    input.onchange = async (e) => {
      const target = e.target as HTMLInputElement;
      const files = Array.from(target.files || []);

      if (files.length > 0) {
        // Set uploading state
        setUploadingStates((prev) => {
          if (section === "ingredient" && typeof index === "number") {
            const newIngredients = [...prev.ingredients];
            newIngredients[index] = true;
            return { ...prev, ingredients: newIngredients };
          }
          return { ...prev, [section]: true };
        });

        const imagesFormData = new FormData();
        files.forEach((file) => {
          imagesFormData.append("file", file);
        });

        try {
          const imageUrl = (await uploadNewFile(imagesFormData)) as string;
          if (imageUrl) {
            callback(imageUrl);
          }
        } catch (error) {
          toast.error("Image upload failed. Please try again later.");
        } finally {
          // Reset uploading state
          setUploadingStates((prev) => {
            if (section === "ingredient" && typeof index === "number") {
              const newIngredients = [...prev.ingredients];
              newIngredients[index] = false;
              return { ...prev, ingredients: newIngredients };
            }
            return { ...prev, [section]: false };
          });
        }
      }
    };

    input.click();
  };

  return (
    <Fragment>
      <CommonBreadcrumb
        title="Add Products"
        parent="products/digital"
        element={
          <div className="d-flex gap-2 justify-content-end">
            <button
              onClick={handleSave}
              className="btn btn-primary"
              disabled={isPosting}
            >
              {isPosting ? "Creating..." : "Save"}
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
          {/* Hero Banner Section */}
          <div className="card">
            <div className="card-header">
              <h5>Hero Banner</h5>
            </div>
            <div className="card-body">
              <div className="digital-add needs-validation">
                <div className="form-group mb-3">
                  <label className="col-form-label pt-0">Title</label>
                  <input
                    className="form-control"
                    type="text"
                    value={generalFormState.heroBanner.title}
                    onChange={(e) =>
                      handleGeneralForm("heroBanner", {
                        ...generalFormState.heroBanner,
                        title: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="form-group mb-3">
                  <label className="col-form-label pt-0">Subtitle</label>
                  <input
                    className="form-control"
                    type="text"
                    value={generalFormState.heroBanner.subtitle}
                    onChange={(e) =>
                      handleGeneralForm("heroBanner", {
                        ...generalFormState.heroBanner,
                        subtitle: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="form-group mb-3">
                  <label className="col-form-label pt-0">Description</label>
                  <textarea
                    className="form-control"
                    rows={4}
                    value={generalFormState.heroBanner.description}
                    onChange={(e) =>
                      handleGeneralForm("heroBanner", {
                        ...generalFormState.heroBanner,
                        description: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="form-group mb-3">
                  <label className="col-form-label pt-0">
                    Background Image
                  </label>
                  <div className="d-flex gap-2 align-items-center mb-2">
                    <button
                      className="btn btn-primary"
                      onClick={() =>
                        handleImageUpload(
                          (imageUrl) =>
                            handleGeneralForm("heroBanner", {
                              ...generalFormState.heroBanner,
                              backgroundImage: imageUrl,
                            }),
                          "heroBanner"
                        )
                      }
                      disabled={uploadingStates.heroBanner}
                    >
                      {uploadingStates.heroBanner
                        ? "Uploading..."
                        : generalFormState.heroBanner.backgroundImage
                        ? "Change Image"
                        : "Upload"}
                    </button>
                  </div>
                  {generalFormState.heroBanner.backgroundImage && (
                    <div className="mt-2" style={{ maxWidth: "200px" }}>
                      <Image
                        src={generalFormState.heroBanner.backgroundImage}
                        alt="Hero Banner Background"
                        width={200}
                        height={200}
                        style={{ objectFit: "contain" }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Daily Ritual Section */}
          <div className="card">
            <div className="card-header">
              <h5>Daily Ritual</h5>
            </div>
            <div className="card-body">
              <div className="digital-add needs-validation">
                <div className="form-group mb-3">
                  <label className="col-form-label pt-0">Title</label>
                  <input
                    className="form-control"
                    type="text"
                    value={generalFormState.dailyRitual.title}
                    onChange={(e) =>
                      handleGeneralForm("dailyRitual", {
                        ...generalFormState.dailyRitual,
                        title: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="form-group mb-3">
                  <label className="col-form-label pt-0">Description</label>
                  <textarea
                    className="form-control"
                    rows={4}
                    value={generalFormState.dailyRitual.description}
                    onChange={(e) =>
                      handleGeneralForm("dailyRitual", {
                        ...generalFormState.dailyRitual,
                        description: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="form-group mb-3">
                  <label className="col-form-label pt-0">Lifestyle Image</label>
                  <div className="d-flex gap-2 align-items-center mb-2">
                    <button
                      className="btn btn-primary"
                      onClick={() =>
                        handleImageUpload(
                          (imageUrl) =>
                            handleGeneralForm("dailyRitual", {
                              ...generalFormState.dailyRitual,
                              lifestyleImage: imageUrl,
                            }),
                          "dailyRitual"
                        )
                      }
                      disabled={uploadingStates.dailyRitual}
                    >
                      {uploadingStates.dailyRitual
                        ? "Uploading..."
                        : generalFormState.dailyRitual.lifestyleImage
                        ? "Change Image"
                        : "Upload"}
                    </button>
                  </div>
                  {generalFormState.dailyRitual.lifestyleImage && (
                    <div className="mt-2" style={{ maxWidth: "200px" }}>
                      <Image
                        src={generalFormState.dailyRitual.lifestyleImage}
                        alt="Daily Ritual Lifestyle"
                        width={200}
                        height={200}
                        style={{ objectFit: "contain" }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Ingredient Highlights Section */}
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5>Ingredient Highlights</h5>
              <span className="text-muted">
                {generalFormState.ingredientHighlights.length}/3 ingredients
              </span>
            </div>
            <div className="card-body">
              <div className="digital-add needs-validation">
                {generalFormState.ingredientHighlights.map(
                  (highlight, index) => (
                    <div key={index} className="border p-3 mb-3">
                      <div className="form-group mb-3">
                        <label className="col-form-label pt-0">Name</label>
                        <input
                          className="form-control"
                          type="text"
                          value={highlight.name}
                          onChange={(e) => {
                            const updatedHighlights = [
                              ...generalFormState.ingredientHighlights,
                            ];
                            updatedHighlights[index].name = e.target.value;
                            handleGeneralForm(
                              "ingredientHighlights",
                              updatedHighlights
                            );
                          }}
                        />
                      </div>
                      <div className="form-group mb-3">
                        <label className="col-form-label pt-0">
                          Description
                        </label>
                        <textarea
                          className="form-control"
                          rows={3}
                          value={highlight.description}
                          onChange={(e) => {
                            const updatedHighlights = [
                              ...generalFormState.ingredientHighlights,
                            ];
                            updatedHighlights[index].description =
                              e.target.value;
                            handleGeneralForm(
                              "ingredientHighlights",
                              updatedHighlights
                            );
                          }}
                        />
                      </div>
                      <div className="form-group mb-3">
                        <label className="col-form-label pt-0">Image</label>
                        <div className="d-flex gap-2 align-items-center mb-2">
                          <button
                            className="btn btn-primary"
                            onClick={() =>
                              handleImageUpload(
                                (imageUrl) => {
                                  const updatedHighlights = [
                                    ...generalFormState.ingredientHighlights,
                                  ];
                                  updatedHighlights[index].image = imageUrl;
                                  handleGeneralForm(
                                    "ingredientHighlights",
                                    updatedHighlights
                                  );
                                },
                                "ingredient",
                                index
                              )
                            }
                            disabled={uploadingStates.ingredients[index]}
                          >
                            {uploadingStates.ingredients[index]
                              ? "Uploading..."
                              : highlight.image
                              ? "Change Image"
                              : "Upload"}
                          </button>
                        </div>
                        {highlight.image && (
                          <div className="mt-2" style={{ maxWidth: "200px" }}>
                            <Image
                              src={highlight.image}
                              alt={`Ingredient ${highlight.name}`}
                              width={200}
                              height={200}
                              style={{ objectFit: "contain" }}
                            />
                          </div>
                        )}
                      </div>
                      <div className="d-flex justify-content-end">
                        <Button
                          color="danger"
                          size="sm"
                          className="dangerBtn px-3 py-2"
                          onClick={() => {
                            const updatedHighlights =
                              generalFormState.ingredientHighlights.filter(
                                (_, i) => i !== index
                              );
                            handleGeneralForm(
                              "ingredientHighlights",
                              updatedHighlights
                            );
                          }}
                        >
                          <AiOutlineDelete size={20} />
                        </Button>
                      </div>
                    </div>
                  )
                )}
                {generalFormState.ingredientHighlights.length < 3 && (
                  <button
                    className="btn btn-primary"
                    onClick={() =>
                      handleGeneralForm("ingredientHighlights", [
                        ...generalFormState.ingredientHighlights,
                        { name: "", description: "", image: "" },
                      ])
                    }
                  >
                    Add Ingredient Highlight
                  </button>
                )}
                {generalFormState.ingredientHighlights.length === 3 && (
                  <div className="alert alert-info mt-2">
                    Maximum limit of 3 ingredients reached
                  </div>
                )}
              </div>
            </div>
          </div>
        </Row>
      </Container>
    </Fragment>
  );
};

export default AddDigitalProduct;
