"use client";

import axios from "axios";
import { toast } from "react-toastify";
import { Fragment, JSX, useEffect, useState } from "react";
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
  UniqueIdentifier,
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

interface SpecialOfferProduct {
  index: number;
  product: string;
}

interface Product {
  _id: string;
  sku: string;
  image_link: string;
  title: string;
  brand: string;
  salePrice: number | null;
  price: number | null;
  category_slug: string;
  sell_on_google_quantity: number;
  variants_count: number;
  heroBanner: string;
  dailyRitual: string;
  ingredientHighlights: number;
}

interface SpecialOffer {
  index: number;
  product: string;
}

const SpecialOfferProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [specialOfferProducts, setSpecialOfferProducts] = useState<
    SpecialOfferProduct[]
  >([]);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const { data } = await axios.get("/api/products/special-offer-products");
      const specialOfferIds =
        data?.specialOfferProducts?.map(
          (item: { product: string }) => item.product
        ) || [];

      const refreshedSelectedProducts = specialOfferIds
        .map((id: string) => products.find((product) => product._id === id))
        .filter(Boolean) as Product[];

      setSelectedProducts(refreshedSelectedProducts);
      setSpecialOfferProducts(data?.specialOfferProducts || []);
      setHasChanges(false);
      toast.success("Special offer products refreshed from database");
    } catch (error) {
      console.error("Error refreshing special offer products:", error);
      toast.error("Failed to refresh special offer products");
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          "/api/products/special-offer-products"
        );
        const specialOfferItems = data?.specialOfferProducts || [];

        setSpecialOfferProducts(specialOfferItems);
        setHasChanges(false);
      } catch (error) {
        console.error("Error fetching special offer products:", error);
        toast.error("Failed to fetch special offer products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleSaveSpecialOfferProducts = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await axios.put("/api/products/special-offer-products/put", {
        specialOfferProducts,
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

      <ProductManagementUI
        products={products}
        setProducts={setProducts}
        specialOfferProducts={specialOfferProducts}
        setSpecialOfferProducts={setSpecialOfferProducts}
        selectedProducts={selectedProducts}
        setSelectedProducts={setSelectedProducts}
        setHasChanges={setHasChanges}
        loading={loading}
        setLoading={setLoading}
        isRefreshing={isRefreshing}
      />
    </Fragment>
  );
};

export default SpecialOfferProducts;

interface ProductManagementUIProps {
  specialOfferProducts: SpecialOffer[];
  setSpecialOfferProducts: React.Dispatch<React.SetStateAction<SpecialOffer[]>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  selectedProducts: Product[];
  setSelectedProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  setHasChanges: React.Dispatch<React.SetStateAction<boolean>>;
  isRefreshing: boolean;
}

export const ProductManagementUI: React.FC<ProductManagementUIProps> = ({
  specialOfferProducts,
  setSpecialOfferProducts,
  loading,
  setLoading,
  selectedProducts,
  setSelectedProducts,
  products,
  setProducts,
  setHasChanges,
  isRefreshing,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/products/get/get-all-products");
        const transformedData = response.data.reverse().map((product: any) => ({
          _id: product._id,
          sku: product.sku,
          image_link: product.variants[0]?.images[0] || "",
          title: product.title,
          brand: product.brand,
          salePrice: product?.salePrice,
          price: product?.price,
          category_slug: product.category?.slug || "",
          sell_on_google_quantity: product.sell_on_google_quantity || 0,
          variants_count: product.variants.length,
          heroBanner: product.heroBanner ? "Yes" : "No",
          dailyRitual: product.dailyRitual ? "Yes" : "No",
          ingredientHighlights: product.ingredientHighlights?.length || 0,
        }));
        setProducts(transformedData);
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [setLoading, setProducts]);

  useEffect(() => {
    if (!selectedProducts.length && products.length) {
      const initialSelected = specialOfferProducts
        .map(({ product }) => products.find((p) => p._id === product))
        .filter(Boolean) as Product[];
      setSelectedProducts(initialSelected);
    }
  }, [products, specialOfferProducts, selectedProducts, setSelectedProducts]);

  const filteredProducts = products.filter((product) => {
    const term = searchTerm.toLowerCase();
    return (
      product.title.toLowerCase().includes(term) ||
      product.sku.toLowerCase().includes(term) ||
      product.brand.toLowerCase().includes(term) ||
      product.category_slug.toLowerCase().includes(term)
    );
  });

  const handleProductSelect = (product: Product) => {
    if (specialOfferProducts.some((item) => item.product === product._id))
      return;
    const newItem: SpecialOffer = {
      index: 0,
      product: product._id,
    };

    // Add new item at the beginning and update indices
    const updatedSpecialOffers = [
      newItem,
      ...specialOfferProducts.map((item) => ({
        ...item,
        index: item.index + 1,
      })),
    ];

    setSpecialOfferProducts(updatedSpecialOffers);
    setSelectedProducts([product, ...selectedProducts]);
    setHasChanges(true);
  };

  const handleRemoveProduct = (productId: string) => {
    setSpecialOfferProducts((prev) =>
      prev
        .filter((item) => item.product !== productId)
        .map((item, index) => ({ ...item, index }))
    );
    setSelectedProducts((prev) =>
      prev.filter((product) => product._id !== productId)
    );
    setHasChanges(true);
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const handleDragEnd = ({ active, over }: any) => {
    if (!over || active.id === over.id) return;
    const oldIndex = selectedProducts.findIndex(
      (product) => product._id === active.id
    );
    const newIndex = selectedProducts.findIndex(
      (product) => product._id === over.id
    );
    const reordered = arrayMove(selectedProducts, oldIndex, newIndex);
    setSelectedProducts(reordered);
    setSpecialOfferProducts(
      reordered.map((product, index) => ({ index, product: product._id }))
    );
    setHasChanges(true);
  };

  const renderTableRows = () => {
    const rows: JSX.Element[] = [];

    // First, handle existing products
    specialOfferProducts.forEach((specialOffer, index) => {
      const product = products.find((p) => p._id === specialOffer.product);

      if (product) {
        rows.push(
          <SortableTableRow
            key={product._id}
            id={product._id}
            index={index}
            product={product}
            onRemove={handleRemoveProduct}
            exists={true}
          />
        );
      } else {
        // Handle non-existing product
        rows.push(
          <tr key={`missing-${specialOffer.product}`}>
            <td colSpan={2} className="text-danger">
              Missing Product (ID: {specialOffer.product})
            </td>
            <td colSpan={3} className="text-danger">
              Product not found in database
            </td>
            <td>
              <Button
                color="danger"
                size="sm"
                className="dangerBtn px-3 py-2"
                onClick={() => handleRemoveProduct(specialOffer.product)}
              >
                <AiOutlineDelete size={20} />
              </Button>
            </td>
          </tr>
        );
      }
    });

    return rows;
  };

  return (
    <Container fluid>
      {loading ? (
        <div>Loading...</div>
      ) : products.length === 0 ? (
        <Card className="shadow-sm border-0">
          <CardBody className="text-center">
            <BiPackage size={48} className="text-muted mb-3" />
            <h4>No Products Found</h4>
            <p>No products have been added yet.</p>
          </CardBody>
        </Card>
      ) : (
        <>
          <Card className="mb-4">
            <CardBody>
              <Input
                type="text"
                placeholder="Search by title, SKU, brand, or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-control-lg"
              />
              <ListGroup className="mt-4">
                {searchTerm &&
                  filteredProducts.map((product) => {
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
          <Card>
            <CardBody>
              <h4>Selected Products</h4>
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={selectedProducts.map((p) => p._id)}
                  strategy={verticalListSortingStrategy}
                >
                  <Table>
                    <thead>
                      <tr>
                        <th>Position</th>
                        <th>Product</th>
                        <th>SKU</th>
                        <th>Brand</th>
                        <th>Price</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>{renderTableRows()}</tbody>
                  </Table>
                </SortableContext>
              </DndContext>
            </CardBody>
          </Card>
        </>
      )}
    </Container>
  );
};

const SortableTableRow = ({
  product,
  onRemove,
  id,
  index,
  exists = true,
}: any) => {
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

  if (!exists) {
    return (
      <tr style={{ backgroundColor: "#fff3f3" }}>
        <td colSpan={2} className="text-danger">
          Missing Product (ID: {id})
        </td>
        <td colSpan={3} className="text-danger">
          Product not found in database
        </td>
        <td>
          <Button
            color="danger"
            size="sm"
            className="dangerBtn px-3 py-2"
            onClick={() => onRemove(id)}
          >
            <AiOutlineDelete size={20} />
          </Button>
        </td>
      </tr>
    );
  }

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
