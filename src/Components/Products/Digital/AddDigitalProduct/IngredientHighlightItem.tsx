import Image from "next/image";
import { Button } from "reactstrap";
import { AiOutlineDelete } from "react-icons/ai";
import { IngredientHighlight } from "@/Types/product";

interface Props {
  highlight: IngredientHighlight;
  index: number;
  isUploading: boolean;
  onUpdate: (updatedHighlight: IngredientHighlight) => void;
  onDelete: () => void;
  onImageUpload: () => void;
}

export const IngredientHighlightItem = ({
  highlight,
  index,
  isUploading,
  onUpdate,
  onDelete,
  onImageUpload,
}: Props) => {
  return (
    <div className="border p-3 mb-3">
      <div className="form-group mb-3">
        <label className="col-form-label pt-0">Name</label>
        <input
          className="form-control"
          type="text"
          value={highlight.name}
          onChange={(e) => onUpdate({ ...highlight, name: e.target.value })}
          maxLength={50}
        />
      </div>
      <div className="form-group mb-3">
        <label className="col-form-label pt-0">Description</label>
        <textarea
          className="form-control"
          rows={3}
          value={highlight.description}
          onChange={(e) =>
            onUpdate({ ...highlight, description: e.target.value })
          }
          maxLength={200}
        />
      </div>
      <div className="form-group mb-3">
        <label className="col-form-label pt-0">Image</label>
        <div className="d-flex gap-2 align-items-center mb-2">
          <button
            className="btn btn-primary"
            onClick={onImageUpload}
            disabled={isUploading}
          >
            {isUploading
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
          onClick={onDelete}
        >
          <AiOutlineDelete size={20} />
        </Button>
      </div>
    </div>
  );
};
