"use client";

import CommonBreadcrumb from "@/CommonComponents/CommonBreadcrumb";
import CommonCardHeader from "@/CommonComponents/CommonCardHeader";
import Datatable from "@/CommonComponents/DataTable";
import { Fragment, useState, useEffect } from "react";
import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Form,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  FormFeedback,
} from "reactstrap";
import axios from "axios";
import { toast } from "react-toastify";
import { LuImagePlus, LuImageOff } from "react-icons/lu";
import { uploadMultipleNewFiles, removeFile } from "@/lib/actions/fileUploads"; // Assuming these functions are available
import { Loader } from "react-feather";
import { useRouter } from "next/navigation";

interface Category {
  title: string;
  image_link: string;
  slug: string;
}

// Add these headers configuration
const axiosConfig = {
  headers: {
    "Cache-Control": "no-cache, no-store, must-revalidate",
    Pragma: "no-cache",
    Expires: "0",
  },
};

const CategoriesDigital = () => {
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCategory, setNewCategory] = useState<Category>({
    title: "",
    image_link: "",
    slug: "",
  });
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [errors, setErrors] = useState<{
    title?: boolean;
    image_link?: boolean;
  }>({});
  const [isUploading, setIsUploading] = useState(false);
  const [creatingCategory, setCreatingCategory] = useState(false);
  const [isEditingModal, setIsEditingModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(false);
  const router = useRouter();

  const onOpenModal = () => {
    setOpen(true);
  };

  const handleUpdateCategory = async () => {
    const newErrors: { title?: boolean; image_link?: boolean } = {};
    if (!newCategory.title) newErrors.title = true;
    if (!newCategory.image_link) newErrors.image_link = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setEditingCategory(true);
      const response = await axios.put(
        `/api/categories/${newCategory.slug}`,
        newCategory,
        axiosConfig
      );
      toast.success(response.data.message);
      const updatedCategories = categories.map((category) => {
        if (category.slug === newCategory.slug) {
          return response.data.category;
        } else {
          return category;
        }
      });
      setCategories(updatedCategories);
      onCloseModal();
    } catch (error) {
      console.error("Error updating category:", error);
      if (error.response.data.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error("Failed to update category");
      }
    } finally {
      setEditingCategory(false);
    }
  };
  const handleOpenEditModal = (category: Category) => {
    setNewCategory(category);
    setIsEditingModal(true);
    setImagePreviews([category.image_link]);
    onOpenModal();
  };
  const onCloseModal = () => {
    setOpen(false);
    setNewCategory({ title: "", image_link: "", slug: "" });
    setImagePreviews([]);
    setErrors({});
  };

  const handleCategoryChange = (field: keyof Category, value: string) => {
    setNewCategory((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*, .gif";
    input.multiple = false;

    input.onchange = async (e) => {
      const target = e.target as HTMLInputElement;
      const files = Array.from(target.files || []);

      if (files.length > 0) {
        setIsUploading(true);
        const imagesFormData = new FormData();
        files.forEach((file) => {
          imagesFormData.append("files", file);
        });

        const imagesUrl = (await uploadMultipleNewFiles(
          imagesFormData
        )) as string[];

        if (!imagesUrl.length) {
          setIsUploading(false);
          return alert("Image upload failed. Please try again later.");
        }

        const nonNullImages = imagesUrl.filter((image) => image !== null);
        setNewCategory((prev) => ({
          ...prev,
          image_link: nonNullImages[0],
        }));

        setImagePreviews(nonNullImages);
        setIsUploading(false);
      }
    };

    input.click();
  };

  const handleRemoveImage = async (imageToRemove: string) => {
    const success = await removeFile(imageToRemove);

    if (success) {
      setNewCategory((prev) => ({
        ...prev,
        image_link: "",
      }));

      setImagePreviews([]);
    } else {
      alert("Image removal failed. Please try again later.");
    }
  };

  const handleAddCategory = async () => {
    const newErrors: { title?: boolean; image_link?: boolean } = {};
    if (!newCategory.title) newErrors.title = true;
    if (!newCategory.image_link) newErrors.image_link = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setCreatingCategory(true);
      const response = await axios.post(
        "/api/categories/create-category",
        newCategory,
        axiosConfig
      );
      toast.success(response.data.message);
      setCategories([...categories, response.data.category]);
      onCloseModal();
    } catch (error) {
      console.error("Error creating category:", error);
      toast.error("Failed to create category");
    } finally {
      setCreatingCategory(false);
    }
  };

  const onDelete = async (row: any): Promise<boolean> => {
    try {
      const response = await axios.delete(
        `/api/categories/${row.slug}`,
        axiosConfig
      );
      if (response.status === 200) {
        setCategories(
          categories.filter((category) => category.slug !== row.slug)
        );
        toast.success("Category deleted successfully");
        return true;
      } else {
        if (response.data.error) {
          toast.error(response.data.error);
        } else {
          toast.error("Failed to delete category");
        }
        return false;
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      if (error.response.data.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error("Failed to delete category");
      }
      return false;
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "/api/categories/all-categories",
          axiosConfig
        );
        // console.log("Fetched Categories:", response.data);
        //only title, image_link and slug to show
        let categoriesToShow = response.data.map((category: any) => {
          return {
            title: category.title,
            image_link: category.image_link,
            slug: category.slug,
          };
        });
        setCategories(categoriesToShow);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Failed to fetch categories");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <Fragment>
      <CommonBreadcrumb title="Categories" parent="products/digital" />
      <Container fluid>
        <Row>
          <Col sm="12">
            <Card>
              <CommonCardHeader title="Product Categories" />
              <CardBody className="pt-0">
                <div className="btn-popup pull-right">
                  <Button color="secondary" onClick={onOpenModal}>
                    Add Category
                  </Button>
                  <Modal isOpen={open} toggle={onCloseModal}>
                    <ModalHeader toggle={onCloseModal}>
                      <h5
                        className="modal-title f-w-600"
                        id="exampleModalLabel2"
                      >
                        {isEditingModal ? "Edit" : "Add"} Category
                      </h5>
                    </ModalHeader>
                    <ModalBody>
                      <Form>
                        <FormGroup>
                          <Label
                            htmlFor="recipient-name"
                            className="col-form-label"
                          >
                            Category Name :
                          </Label>
                          <Input
                            type="text"
                            name="title"
                            value={newCategory.title}
                            onChange={(e) =>
                              handleCategoryChange("title", e.target.value)
                            }
                            invalid={!!errors.title}
                            required
                          />
                          {errors.title && (
                            <FormFeedback>
                              Category Name is required
                            </FormFeedback>
                          )}
                        </FormGroup>
                        <FormGroup>
                          <Label className="col-form-label pt-0">
                            Category Image
                          </Label>
                          <Button
                            type="button"
                            color="primary"
                            onClick={handleImageUpload}
                            disabled={isUploading}
                            className="w-fit h-fit p-2 px-3 cursor-pointer bg-blue-100 hover:bg-blue-200 d-flex align-items-center"
                          >
                            <LuImagePlus size={20} className=" m-r-10" />
                            Add Image
                            {isUploading && (
                              <Loader size={20} className="ms-2" />
                            )}
                          </Button>
                          <div className="image-previews mt-5">
                            <Row>
                              {imagePreviews.map((src, index) => (
                                <Col xs="6" key={index} className="mb-4">
                                  <div className="d-flex align-items-center">
                                    <img
                                      src={src}
                                      alt="Preview"
                                      className="img-thumbnail me-2"
                                      style={{
                                        width: "80%",
                                        aspectRatio: 1,
                                        objectFit: "cover",
                                        objectPosition: "top",
                                      }}
                                    />
                                    <Button
                                      type="button"
                                      onClick={() => handleRemoveImage(src)}
                                      className="w-fit h-fit p-2 text-black bg-red-100 hover:bg-red-200"
                                    >
                                      <LuImageOff size={16} />
                                    </Button>
                                  </div>
                                </Col>
                              ))}
                            </Row>
                          </div>
                          {errors.image_link && (
                            <FormFeedback className="d-block">
                              Category Image is required
                            </FormFeedback>
                          )}
                        </FormGroup>
                      </Form>
                    </ModalBody>
                    <ModalFooter>
                      {isEditingModal ? (
                        <Button
                          type="button"
                          color="primary"
                          onClick={handleUpdateCategory}
                          disabled={editingCategory}
                        >
                          {editingCategory ? <Loader size={20} /> : "Update"}
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          color="primary"
                          onClick={handleAddCategory}
                          disabled={creatingCategory}
                        >
                          {creatingCategory ? <Loader size={20} /> : "Save"}
                        </Button>
                      )}
                      <Button
                        type="button"
                        color="secondary"
                        onClick={onCloseModal}
                      >
                        Close
                      </Button>
                    </ModalFooter>
                  </Modal>
                </div>
                <div className="clearfix"></div>
                <div id="basicScenario" className="product-physical">
                  {loading ? (
                    <div>Loading...</div>
                  ) : (
                    <Datatable
                      multiSelectOption={false}
                      myData={categories}
                      pageSize={6}
                      pagination={false}
                      class="-striped -highlight"
                      isDelete={true}
                      isEditable={true}
                      onClickField={"title"}
                      loading={loading}
                      handleOpenEditModal={handleOpenEditModal}
                      handleOnClick={(row: any) => {
                        console.log("Clicked Category:", row.title);
                        router.push(
                          `/en/products/digital/product-detail/${row.slug}`
                        );
                      }}
                      onDelete={onDelete}
                    />
                  )}
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </Fragment>
  );
};

export default CategoriesDigital;
