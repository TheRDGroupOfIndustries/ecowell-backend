"use client";

import { useState, useCallback } from "react";
import { toast } from "react-toastify";
import { uploadNewFile } from "@/lib/actions/fileUploads";
import { IngredientHighlight, MAX_INGREDIENTS } from "@/Types/product";
import { IngredientHighlightItem } from "./IngredientHighlightItem";

interface Props {
  ingredientHighlights: IngredientHighlight[];
  onUpdate: (data: IngredientHighlight[]) => void;
}

const IngredientHighlightsForm = ({
  ingredientHighlights,
  onUpdate,
}: Props) => {
  const [uploadingIndices, setUploadingIndices] = useState<Set<number>>(
    new Set()
  );

  const handleImageUpload = useCallback(
    async (index: number) => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";

      input.onchange = async (e) => {
        const target = e.target as HTMLInputElement;
        const file = target.files?.[0];

        if (!file) return;

        setUploadingIndices((prev) => new Set(prev).add(index));

        try {
          const formData = new FormData();
          formData.append("file", file);
          const imageUrl = (await uploadNewFile(formData)) as string;

          if (imageUrl) {
            const updatedHighlights = [...ingredientHighlights];
            updatedHighlights[index] = {
              ...updatedHighlights[index],
              image: imageUrl,
            };
            onUpdate(updatedHighlights);
          }
        } catch (error) {
          toast.error("Image upload failed. Please try again.");
        } finally {
          setUploadingIndices((prev) => {
            const next = new Set(prev);
            next.delete(index);
            return next;
          });
        }
      };

      input.click();
    },
    [ingredientHighlights, onUpdate]
  );

  return (
    <div className="card">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h5>Ingredient Highlights</h5>
        <span className="text-muted">
          {ingredientHighlights.length}/{MAX_INGREDIENTS} ingredients
        </span>
      </div>
      <div className="card-body">
        <div className="digital-add needs-validation">
          {ingredientHighlights.map((highlight, index) => (
            <IngredientHighlightItem
              key={index}
              highlight={highlight}
              index={index}
              isUploading={uploadingIndices.has(index)}
              onUpdate={(updatedHighlight) => {
                const updatedHighlights = [...ingredientHighlights];
                updatedHighlights[index] = updatedHighlight;
                onUpdate(updatedHighlights);
              }}
              onDelete={() => {
                onUpdate(ingredientHighlights.filter((_, i) => i !== index));
              }}
              onImageUpload={() => handleImageUpload(index)}
            />
          ))}

          {ingredientHighlights.length < MAX_INGREDIENTS && (
            <button
              className="btn btn-primary"
              onClick={() =>
                onUpdate([
                  ...ingredientHighlights,
                  { name: "", description: "", image: "" },
                ])
              }
            >
              Add Ingredient Highlight
            </button>
          )}

          {ingredientHighlights.length === MAX_INGREDIENTS && (
            <div className="alert alert-info mt-2">
              Maximum limit of {MAX_INGREDIENTS} ingredients reached
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IngredientHighlightsForm;
