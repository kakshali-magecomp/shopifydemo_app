import React, { useState, useEffect } from "react";
import { SaveBar, useAppBridge } from '@shopify/app-bridge-react';
import {
  Page,
  Card,
  FormLayout,
  TextField,
  Select,
  Banner,
} from "@shopify/polaris";
import { useNavigate } from "react-router-dom";

export default function CreatePage() {
  const navigate = useNavigate();
  const shopify = useAppBridge(); // Get the App Bridge instance to control UI elements

  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState("");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [vendor, setVendor] = useState("");
  const [productType, setProductType] = useState("");
  const [tags, setTags] = useState("");
  const [status, setStatus] = useState("ACTIVE");
  const [isDirty, setIsDirty] = useState(false);

  // CONTROL SAVE BAR VISIBILITY
  // The SaveBar must be permanently mounted, and visibility toggled via App Bridge API
  useEffect(() => {
    if (shopify) {
      if (isDirty) {
        shopify.saveBar.show("my-save-bar");
      } else {
        shopify.saveBar.hide("my-save-bar");
      }
    }
  }, [isDirty, shopify]);

  // CLEAN PREVIEW MEMORY LEAK
  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  // RESET FORM STATE (DISCARD)
  const handleDiscard = () => {
    setTitle("");
    setDescription("");
    setVendor("");
    setProductType("");
    setTags("");
    setStatus("ACTIVE");
    setImageFile(null);
    setPreview("");
    setError("");
    setIsDirty(false); // This automatically triggers shopify.saveBar.hide() via useEffect
  };

  // CREATE PRODUCT (SAVE)
  const createProduct = async () => {
    try {
      setError("");

      if (!title.trim()) {
        setError("Product title is required");
        return;
      }

      setSaving(true);

      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("description", description.trim());
      formData.append("vendor", vendor.trim());
      formData.append("productType", productType.trim());
      formData.append("status", status);

      // CLEAN TAGS
      const cleanTags = tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
        .join(",");

      formData.append("tags", cleanTags);

      if (imageFile) {
        formData.append("image", imageFile);
      }

      console.log("CREATE PRODUCT REQUEST:", {
        title,
        description,
        vendor,
        productType,
        tags: cleanTags,
        status,
        imageFile,
      });

      const response = await fetch("/api/products/create", {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: formData,
      });

      const text = await response.text();
      let json;

      try {
        json = JSON.parse(text);
      } catch (e) {
        throw new Error("Server returned invalid JSON");
      }

      console.log("CREATE RESPONSE:", json);

      if (!json.status) {
        throw new Error(
          json.error ||
          json.message ||
          "Failed to create product"
        );
      }

      // SUCCESS RESET
      handleDiscard();
      shopify.toast.show("Product Created Successfully");
      navigate("/");

    } catch (err) {
      console.error(err);
      shopify.toast.show(err.message || "Something went wrong", {
        isError: true,
      });
    } finally {
      setSaving(false);
    }
  };

  // Dynamic helper to update values and mark form as dirty
  const handleFieldChange = (setter) => (value) => {
    setter(value);
    setIsDirty(true);
  };

  return (
    <Page
      title="Create Product"
      backAction={{
        content: "Products",
        onAction: () => navigate("/"),
      }}
    >
      {/* 
        CRITICAL FIX: Keep the SaveBar rendered at all times. 
        Do not use short-circuit rendering ({isDirty && <SaveBar />})
      */}
      <SaveBar id="my-save-bar">
        <button variant="primary" loading={saving ? "true" : undefined} onClick={createProduct}>
          Save
        </button>
        <button onClick={handleDiscard}>Discard</button>
      </SaveBar>

      {/* ERROR BANNER */}
      {error && (
        <div style={{ marginBottom: 20 }}>
          <Banner tone="critical">
            <p>{error}</p>
          </Banner>
        </div>
      )}

      <Card>
        <div style={{ padding: 20 }}>
          <FormLayout>
            <TextField
              label="Product Title"
              value={title}
              onChange={handleFieldChange(setTitle)}
              autoComplete="off"
            />

            <TextField
              label="Description"
              value={description}
              onChange={handleFieldChange(setDescription)}
              multiline={6}
              autoComplete="off"
            />

            <TextField
              label="Vendor"
              value={vendor}
              onChange={handleFieldChange(setVendor)}
              autoComplete="off"
            />

            <TextField
              label="Product Type"
              value={productType}
              onChange={handleFieldChange(setProductType)}
              autoComplete="off"
            />

            <TextField
              label="Tags"
              value={tags}
              onChange={handleFieldChange(setTags)}
              helpText="Example: shoes, fashion, men"
              autoComplete="off"
            />

            <Select
              label="Status"
              value={status}
              onChange={handleFieldChange(setStatus)}
              options={[
                { label: "Active", value: "ACTIVE" },
                { label: "Draft", value: "DRAFT" },
                { label: "Archived", value: "ARCHIVED" },
              ]}
            />

            {/* IMAGE UPLOAD */}
            <div>
              <label style={{ fontWeight: 500, display: 'block', marginBottom: '8px' }}>
                Select Image
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                  if (!file.type.startsWith("image/")) {
                    setError("Only image files allowed");
                    return;
                  }

                  setImageFile(file);
                  setIsDirty(true);

                  const previewUrl = URL.createObjectURL(file);
                  setPreview(previewUrl);
                }}
              />
            </div>

            {/* IMAGE PREVIEW */}
            {preview && (
              <div>
                <img
                  src={preview}
                  alt="Preview"
                  style={{
                    width: "220px",
                    borderRadius: "8px",
                    border: "1px solid #ddd",
                    marginTop: "10px",
                  }}
                />
              </div>
            )}
          </FormLayout>
        </div>
      </Card>
    </Page>
  );
}

