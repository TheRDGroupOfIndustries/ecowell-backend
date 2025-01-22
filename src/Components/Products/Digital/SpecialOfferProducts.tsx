"use client";

import axios from "axios";
import { toast } from "react-toastify";
import { Fragment, useEffect, useState } from "react";
import Link from "next/link";
import { AiOutlineDelete, AiOutlineEye } from "react-icons/ai";
import {
  Input,
  Table,
  Card,
  CardBody,
  Button,
  ListGroup,
  ListGroupItem,
  Container,
} from "reactstrap";
import CommonBreadcrumb from "@/CommonComponents/CommonBreadcrumb";
import { FiSearch } from "react-icons/fi";
import { BiPackage, BiRefresh } from "react-icons/bi";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { MdDragIndicator } from "react-icons/md";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";

const SortableTableRow = ({ product, onRemove, id, index }: any) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: id,
    data: {
      index,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    backgroundColor: isDragging ? "#f8f9fa" : "inherit",
    touchAction: "none",
    zIndex: isDragging ? 1 : 0,
  };

  return (
    <tr ref={setNodeRef} style={style}>
      <td>
        <div className="d-flex align-items-center">
          <span className="me-3">{index + 1}</span>
          <div
            {...attributes}
            {...listeners}
            style={{ cursor: "move", padding: "8px" }}
          >
            <MdDragIndicator size={24} className="text-muted" />
          </div>
        </div>
      </td>
      <td>
        <div className="d-flex align-items-center">
          <img
            src={product.image_link}
            alt={product.title}
            className="rounded"
            style={{
              width: "40px",
              height: "40px",
              objectFit: "cover",
            }}
          />
          <span className="ms-3">{product.title}</span>
        </div>
      </td>
      <td>{product.sku}</td>
      <td>{product.brand}</td>
      <td>
        <span className="fw-bold">₹{product.salePrice || product.price}</span>
      </td>
      <td className="d-flex gap-3">
        <Link href={`/en/products/digital/digital-edit-product/${product.sku}`}>
          <Button color="secondary" size="sm" className="px-3 py-2">
            <AiOutlineEye size={20} />
          </Button>
        </Link>
        <Button
          color="danger"
          size="sm"
          className="dangerBtn px-3 py-2"
          onClick={() => onRemove(product._id)}
        >
          <AiOutlineDelete size={20} />
        </Button>
      </td>
    </tr>
  );
};

const SpecialOfferProducts = () => {
  const [specialOfferProducts, setSpecialOfferProducts] = useState<
    { index: number; product: string }[]
  >([]);
  const [selectedProducts, setSelectedProducts] = useState<any[]>([]);
  const [hasChanges, setHasChanges] = useState(false);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/products/get/get-all-products");
        const specialOfferProductsResponse = await axios.get(
          "/api/products/special-offer-products"
        );
        const data = specialOfferProductsResponse.data;

        // Get the ordered array of products with index
        const specialOfferItems = data?.specialOfferProducts || [];
        setSpecialOfferProducts(specialOfferItems);

        const transformedData = response.data.reverse().map((product: any) => ({
          _id: product._id,
          sku: product.sku,
          image_link: product.variants[0].images[0],
          title: product.title,
          brand: product.brand,
          salePrice: product?.salePrice,
          price: product?.price,
          category_slug: product.category.slug,
          sell_on_google_quantity: product.sell_on_google_quantity,
          variants_count: product.variants.length,
          heroBanner: product.heroBanner ? "Yes" : "No",
          dailyRitual: product.dailyRitual ? "Yes" : "No",
          ingredientHighlights: product.ingredientHighlights
            ? product.ingredientHighlights.length
            : 0,
        }));

        // Sort the selected products according to specialOfferItems order
        const initialSelectedProducts = specialOfferItems
          .map(({ product }: { product: string }) =>
            transformedData.find((p: any) => p._id === product)
          )
          .filter(Boolean);

        setSelectedProducts(initialSelectedProducts);
        setProducts(transformedData);
        setHasChanges(false); // Reset changes after fetch
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const specialOfferProductsResponse = await axios.get(
        "/api/products/special-offer-products"
      );
      const data = specialOfferProductsResponse.data;

      const specialOfferIds =
        data?.specialOfferProducts?.map(
          (item: { product: string }) => item.product
        ) || [];

      // Update the order using existing products data
      const refreshedSelectedProducts = specialOfferIds
        .map((_id: string) =>
          products.find((product: any) => product._id === _id)
        )
        .filter(Boolean);

      setSelectedProducts(refreshedSelectedProducts);
      setSpecialOfferProducts(specialOfferIds);
      setHasChanges(false); // Reset changes after refresh
      toast.success("Products order refreshed from database");
    } catch (error) {
      console.error("Error refreshing products:", error);
      toast.error("Failed to refresh products");
    } finally {
      setIsRefreshing(false);
    }
  };

  const filteredProducts = products.filter((product: any) => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      product.title.toLowerCase().includes(searchTermLower) ||
      product.sku.toLowerCase().includes(searchTermLower) ||
      product.brand.toLowerCase().includes(searchTermLower) ||
      product.category_slug.toLowerCase().includes(searchTermLower)
    );
  });

  const handleProductSelect = (product: any) => {
    const isProductSelected = specialOfferProducts.some(
      (item) => item.product === product._id
    );
    if (!isProductSelected) {
      const newItem = {
        index: specialOfferProducts.length,
        product: product._id,
      };
      setSpecialOfferProducts([...specialOfferProducts, newItem]);
      setSelectedProducts([...selectedProducts, product]);
      setHasChanges(true); // Set changes when product is added
    }
  };

  const handleRemoveProduct = (productId: string) => {
    setSpecialOfferProducts(
      specialOfferProducts
        .filter((item) => item.product !== productId)
        .map((item, idx) => ({ ...item, index: idx })) // Reindex remaining items
    );
    setSelectedProducts(
      selectedProducts.filter((p: any) => p._id !== productId)
    );
    setHasChanges(true); // Set changes when product is removed
  };

  const handleSaveSpecialOfferProducts = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await axios.put("/api/products/special-offer-products/put", {
        specialOfferProducts: specialOfferProducts,
      });
      toast.success("Special offer products updated successfully");
    } catch (error) {
      console.error("Error saving special offer products:", error);
      toast.error("Failed to update special offer products");
    } finally {
      setIsSaving(false);
      setHasChanges(false);
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = selectedProducts.findIndex(
      (item) => item._id === active.id
    );
    const newIndex = selectedProducts.findIndex((item) => item._id === over.id);

    const newSelectedProducts = arrayMove(selectedProducts, oldIndex, newIndex);

    const newSpecialOfferProducts = newSelectedProducts.map((item, index) => ({
      index,
      product: item._id,
    }));

    setSelectedProducts(newSelectedProducts);
    setSpecialOfferProducts(newSpecialOfferProducts);
    setHasChanges(true);
  };

  return (
    <Fragment>
      <CommonBreadcrumb
        title="Special Offer Products"
        parent="products/digital"
        element={
          <div className="d-flex gap-2 justify-content-end">
            {products.length > 0 && (
              <>
                <button
                  type="button"
                  className="btn btn-outline-primary px-4 py-2"
                  onClick={handleRefresh}
                  disabled={isRefreshing || isSaving}
                >
                  {isRefreshing ? (
                    <span className="spinner-border spinner-border-sm" />
                  ) : (
                    <BiRefresh size={20} />
                  )}
                </button>
                <button
                  type="button"
                  className="btn btn-primary px-4 py-2"
                  onClick={handleSaveSpecialOfferProducts}
                  disabled={!hasChanges || isSaving || isRefreshing || loading}
                >
                  {isSaving ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" />
                      Saving...
                    </>
                  ) : (
                    `Save (${selectedProducts.length})`
                  )}
                </button>
              </>
            )}
            <Link
              href="/en/products/digital/digital-product-list"
              className="btn btn-outline-secondary px-4 py-2"
            >
              Cancel
            </Link>
          </div>
        }
      />

      <Container fluid>
        {loading ? (
          <div className="row g-3 mt-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="col-12">
                <div className="card">
                  <div className="card-body">
                    <div className="placeholder-glow">
                      <div className="placeholder col-6 mb-2"></div>
                      <div className="placeholder col-4"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <Card className="shadow-sm border-0">
            <CardBody className="text-center p-5">
              <BiPackage size={48} className="text-muted mb-3" />
              <h4>No Products Found</h4>
              <p className="text-muted">
                No products have been added to the database yet.
              </p>
            </CardBody>
          </Card>
        ) : (
          <>
            <Card className="mb-4 shadow-sm border-0">
              <CardBody>
                <h4 className="mb-4">Search Products</h4>
                <div className="position-relative">
                  <FiSearch className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
                  <Input
                    type="text"
                    placeholder="Search by title, SKU, brand, or category..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="form-control-lg ps-5"
                    style={{ backgroundColor: "#f8f9fa" }}
                  />
                </div>

                <ListGroup
                  className="mt-4"
                  style={{ maxHeight: "250px", overflowY: "auto" }}
                >
                  {searchTerm &&
                    filteredProducts.map((product: any) => {
                      const isSelected = specialOfferProducts.some(
                        (item) => item.product === product._id
                      );
                      return (
                        <ListGroupItem
                          key={product._id}
                          action={!isSelected}
                          onClick={() =>
                            !isSelected && handleProductSelect(product)
                          }
                          className={`border-0 mb-2 rounded ${
                            isSelected ? "bg-light" : "hover-shadow"
                          }`}
                          style={{
                            cursor: isSelected ? "not-allowed" : "pointer",
                            transition: "all 0.2s ease",
                          }}
                        >
                          <div className="d-flex align-items-center">
                            <img
                              src={product.image_link}
                              alt={product.title}
                              className="rounded"
                              style={{
                                width: "50px",
                                height: "50px",
                                objectFit: "cover",
                              }}
                            />
                            <div className="ms-3 flex-grow-1">
                              <div className="d-flex justify-content-between align-items-center">
                                <span className="fw-bold text-black">
                                  {product.title}
                                </span>
                                {isSelected && (
                                  <span className="badge bg-success px-3 py-2">
                                    Selected
                                  </span>
                                )}
                              </div>
                              <small className="text-muted">
                                SKU: {product.sku} • Brand: {product.brand} •
                                Category: {product.category_slug}
                              </small>
                            </div>
                          </div>
                        </ListGroupItem>
                      );
                    })}
                </ListGroup>
              </CardBody>
            </Card>

            <Card className="shadow-sm border-0">
              <CardBody>
                <h4 className="mb-4">
                  Selected Products ({selectedProducts.length})
                </h4>
                <div className="position-relative">
                  <Table hover responsive className="align-middle">
                    <thead className="bg-light">
                      <tr>
                        <th style={{ width: "100px" }}>Order</th>
                        <th>Product</th>
                        <th>SKU</th>
                        <th>Brand</th>
                        <th>Price</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <DndContext
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      onDragEnd={handleDragEnd}
                      modifiers={[restrictToVerticalAxis]}
                    >
                      <tbody>
                        <SortableContext
                          items={selectedProducts.map((item) => item._id)}
                          strategy={verticalListSortingStrategy}
                        >
                          {selectedProducts.map((product, index) => (
                            <SortableTableRow
                              index={index}
                              key={product._id}
                              id={product._id}
                              product={product}
                              onRemove={handleRemoveProduct}
                            />
                          ))}
                        </SortableContext>
                      </tbody>
                    </DndContext>
                  </Table>
                </div>
              </CardBody>
            </Card>
          </>
        )}
      </Container>
    </Fragment>
  );
};

export default SpecialOfferProducts;
