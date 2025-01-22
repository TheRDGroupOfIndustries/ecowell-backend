"use client";

import Image from "next/image";
import { uploadNewFile } from "@/lib/actions/fileUploads";
import { useState } from "react";
import { toast } from "react-toastify";

interface HeroBannerFormProps {
  heroBanner: {
    title: string;
    subtitle: string;
    description: string;
    backgroundImage: string;
  };
  onUpdate: (data: any) => void;
}

const HeroBannerForm = ({ heroBanner, onUpdate }: HeroBannerFormProps) => {
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
        setIsUploading(true);

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
          setIsUploading(false);
        }
      }
    };

    input.click();
  };
  return (
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
              value={heroBanner.title}
              onChange={(e) =>
                onUpdate({
                  ...heroBanner,
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
              value={heroBanner.subtitle}
              onChange={(e) =>
                onUpdate({
                  ...heroBanner,
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
              value={heroBanner.description}
              onChange={(e) =>
                onUpdate({
                  ...heroBanner,
                  description: e.target.value,
                })
              }
            />
          </div>
          <div className="form-group mb-3">
            <label className="col-form-label pt-0">Background Image</label>
            <div className="d-flex gap-2 align-items-center mb-2">
              <button
                className="btn btn-primary"
                onClick={() =>
                  handleImageUpload(
                    (imageUrl) =>
                      onUpdate({
                        ...heroBanner,
                        backgroundImage: imageUrl,
                      }),
                    "heroBanner"
                  )
                }
                disabled={isUploading}
              >
                {isUploading
                  ? "Uploading..."
                  : heroBanner.backgroundImage
                  ? "Change Image"
                  : "Upload"}
              </button>
            </div>
            {heroBanner.backgroundImage && (
              <div className="mt-2" style={{ maxWidth: "200px" }}>
                <Image
                  src={heroBanner.backgroundImage}
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
  );
};

export default HeroBannerForm;
