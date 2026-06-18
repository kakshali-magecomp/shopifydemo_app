import React, { useEffect, useState } from "react";
import {
  Page,
  Card,
  TextField,
  Button,
  FormLayout,
  Spinner,
  Select,
  Banner,
} from "@shopify/polaris";

import {
  SaveBar,
  useAppBridge,
} from "@shopify/app-bridge-react";

import { useNavigate } from "react-router-dom";

function EditPage() {
  const navigate = useNavigate();
  const shopify = useAppBridge();
  const [isDirty, setIsDirty] = useState(false);
  const [originalData, setOriginalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [id, setId] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [vendor, setVendor] = useState("");
  const [productType, setProductType] = useState("");
  const [tags, setTags] = useState("");
  const [status, setStatus] = useState("ACTIVE");

  const [imageFiles, setImageFiles] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [removeImages, setRemoveImages] = useState([]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const pid = params.get("id");

    if (!pid) {
      setError("Product ID not found");
      setLoading(false);
      return;
    }

    setId(pid);
    loadProduct(pid);
  }, []);

  useEffect(() => {
    if (!shopify) return;

    if (isDirty) {
      shopify.saveBar.show("edit-save-bar");
    } else {
      shopify.saveBar.hide("edit-save-bar");
    }
  }, [isDirty, shopify]);

  const handleDiscard = () => {
    if (!originalData) return;

    setTitle(originalData.title);
    setDescription(originalData.description);
    setVendor(originalData.vendor);
    setProductType(originalData.productType);
    setTags(originalData.tags);
    setStatus(originalData.status);

    setImageFiles([]);
    setRemoveImages([]);
    setIsDirty(false);
    shopify.toast.show("Changes discarded");
  };

  const handleFieldChange = (setter) => (value) => {
    setter(value);
    setIsDirty(true);
  };
  const loadProduct = async (pid) => {
    try {
      setLoading(true);

      const response = await fetch(
        `/api/products/${encodeURIComponent(pid)}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const json = await response.json();

      if (!json.status) {
        throw new Error(json.error || "Failed to load product");
      }

      const p = json.product;
      setOriginalData({
        title: p.title || "",
        description: p.descriptionHtml || "",
        vendor: p.vendor || "",
        productType: p.productType || "",
        tags: Array.isArray(p.tags)
          ? p.tags.join(", ")
          : "",
        status: p.status || "ACTIVE",
      });

      setTitle(p.title || "");
      setDescription(p.descriptionHtml || "");
      setVendor(p.vendor || "");
      setProductType(p.productType || "");
      setStatus(p.status || "ACTIVE");
      setTags(Array.isArray(p.tags) ? p.tags.join(", ") : "");

      setExistingImages(
        p.media?.nodes?.map((img) => ({
          id: img.id,
          url: img.image?.url,
        })) || []
      );

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async () => {
    try {
      setSaving(true);
      setError("");

      const formData = new FormData();

      formData.append("id", id);
      formData.append("title", title);
      formData.append("description", description);
      formData.append("vendor", vendor);
      formData.append("productType", productType);
      formData.append("tags", tags);
      formData.append("status", status);

      imageFiles.forEach((file) => {
        formData.append("images[]", file);
      });

      formData.append(
        "removeImages",
        JSON.stringify(removeImages)
      );

      const response = await fetch(
        "/api/products/update",
        {
          method: "POST",
          body: formData,
        }
      );

      const json = await response.json();

      if (!json.status) {
        throw new Error(
          json.error || "Product update failed"
        );
      }

      shopify.toast.show("Product Update Successfully");
      setIsDirty(false);
      navigate("/");

    } catch (err) {
      setError(err.message);
      shopify.toast.show(err.message || "Something Went Wrong",
        {
          isError: true,
        }
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Page>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            padding: "50px",
          }}
        >
          <Spinner size="large" />
        </div>
      </Page>
    );
  }

  return (
    <Page
      title="Edit Product"
      backAction={{
        content: "Back",
        onAction: () => navigate("/"),
      }}
    >
      <SaveBar id="edit-save-bar">
        <button
          variant="primary"
          onClick={updateProduct}
          disabled={saving}
        >
          {saving ? "Saving.." : "Save"}
        </button>

        <button onClick={handleDiscard}
          disabled={saving}>
          Discard
        </button>
      </SaveBar>

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

            {/* Existing Images */}
            {existingImages.length > 0 && (
              <>
                <h3>Current Images</h3>

                <div
                  style={{
                    display: "flex",
                    gap: 15,
                    flexWrap: "wrap",
                    marginBottom: 20,
                  }}
                >
                  {existingImages.map((img) => (
                    <div
                      key={img.id}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <img
                        src={img.url}
                        alt=""
                        style={{
                          width: 150,
                          height: 150,
                          objectFit: "cover",
                          borderRadius: 8,
                          border: "1px solid #ddd",
                        }}
                      />

                      <label
                        style={{
                          marginTop: 10,
                          cursor: "pointer",
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={removeImages.includes(img.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setRemoveImages((prev) => [...prev, img.id]);
                              setIsDirty(true);
                            } else {
                              setRemoveImages((prev) =>
                                prev.filter((id) => id !== img.id));
                              setIsDirty(true);
                            }
                          }}
                        />
                        {" "}Remove Image
                      </label>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Upload New Images */}
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: 8,
                  fontWeight: 600,
                }}
              >
                Upload New Images
              </label>

              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => {
                  const files = Array.from(
                    e.target.files || []
                  );

                  setImageFiles(files);
                  setIsDirty(true);
                }}
              />
            </div>

            {/* New Image Preview */}
            {imageFiles.length > 0 && (
              <>
                <h3>New Images</h3>

                <div
                  style={{
                    display: "flex",
                    gap: 15,
                    flexWrap: "wrap",
                  }}
                >
                  {imageFiles.map((file, index) => (
                    <img
                      key={index}
                      src={URL.createObjectURL(file)}
                      alt=""
                      style={{
                        width: 150,
                        height: 150,
                        objectFit: "cover",
                        borderRadius: 8,
                        border: "1px solid #ddd",
                      }}
                    />
                  ))}
                </div>
              </>
            )}

            <TextField
              label="Title"
              value={title}
              onChange={handleFieldChange(setTitle)}
              autoComplete="off"
            />

            <TextField
              label="Description"
              value={description}
              onChange={handleFieldChange(setDescription)}
              multiline={5}
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
              autoComplete="off"
            />

            <Select
              label="Status"
              value={status}
              onChange={handleFieldChange(setStatus)}
              options={[
                {
                  label: "Active",
                  value: "ACTIVE",
                },
                {
                  label: "Draft",
                  value: "DRAFT",
                },
                {
                  label: "Archived",
                  value: "ARCHIVED",
                },
              ]}
            />

            {/* <Button
              variant="primary"
              loading={saving}
              onClick={updateProduct}
            >
              Update Product
            </Button> */}

          </FormLayout>
        </div>
      </Card>
    </Page>
  );
}

export default EditPage;