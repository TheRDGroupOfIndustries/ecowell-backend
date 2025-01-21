"use client";

import Image from "next/image";
import { uploadNewFile } from "@/lib/actions/fileUploads";
import { useState } from "react";
import { toast } from "react-toastify";

interface DailyRitualFormProps {
  dailyRitual: {
    title: string;
    description: string;
    lifestyleImage: string;
  };
  onUpdate: (data: any) => void;
}

const DailyRitualForm = ({ dailyRitual, onUpdate }: DailyRitualFormProps) => {
  const [uploadingStates, setUploadingStates] = useState({
    heroBanner: false,
    dailyRitual: false,
    ingredients: new Array(3).fill(false),
  });
  const [isUploading, setIsUploading] = useState(false);

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
              value={dailyRitual.title}
              onChange={(e) =>
                onUpdate({
                  ...dailyRitual,
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
              value={dailyRitual.description}
              onChange={(e) =>
                onUpdate({
                  ...dailyRitual,
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
                      onUpdate({
                        ...dailyRitual,
                        lifestyleImage: imageUrl,
                      }),
                    "dailyRitual"
                  )
                }
                disabled={isUploading}
              >
                {isUploading
                  ? "Uploading..."
                  : dailyRitual.lifestyleImage
                  ? "Change Image"
                  : "Upload"}
              </button>
            </div>
            {dailyRitual.lifestyleImage && (
              <div className="mt-2" style={{ maxWidth: "200px" }}>
                <Image
                  src={dailyRitual.lifestyleImage}
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
  );
};

export default DailyRitualForm;
