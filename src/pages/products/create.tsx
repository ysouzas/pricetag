import React, { useState, useEffect } from "react";
import { Box, TextField, Button } from "@mui/material";
import { Create } from "@refinedev/mui";
import { useForm } from "@refinedev/react-hook-form";
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import { BarcodeScannerFab } from "../../components/shared/barcodeScannerFab";

interface IProductForm {
  name: string;
  brand?: string;
  description?: string;
  barcode: string;
  image_url?: string;
}

export const ProductCreate: React.FC = () => {
  const {
    saveButtonProps,
    refineCore: { formLoading },
    register,
    setValue,
    formState: { errors },
  } = useForm<IProductForm>();

  // State to control the scanner and store scanned barcode.
  const [scanning, setScanning] = useState<boolean>(false);
  const [scannedBarcode, setScannedBarcode] = useState<string>("");

  const handleCapture = (barcode: string): void => {
    setValue("barcode", barcode, { shouldValidate: true });
    setScannedBarcode(barcode);
    setScanning(false);
  };

  // When scannedBarcode changes, fetch product details from Open Food Facts.
  useEffect(() => {
    if (scannedBarcode) {
      fetch(
        `https://pt.openfoodfacts.org/api/v0/product/${scannedBarcode}.json`
      )
        .then((res) => res.json())
        .then((json) => {
          if (
            json.status === 1 &&
            json.product &&
            json.product.image_front_url
          ) {
            setValue("image_url", json.product.image_front_url, {
              shouldValidate: true,
            });
          } else {
            console.error("Product not found or no image available", json);
          }
        })
        .catch((error) => {
          console.error("Error fetching product details:", error);
        });
    }
  }, [scannedBarcode, setValue]);

  return (
    <Create isLoading={formLoading} saveButtonProps={saveButtonProps}>
      <Box
        component="form"
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        autoComplete="off"
      >
        {/* Name Field */}
        <TextField
          {...register("name", { required: "This field is required" })}
          error={Boolean(errors.name)}
          helperText={
            typeof errors.name?.message === "string" ? errors.name.message : ""
          }
          fullWidth
          slotProps={{ inputLabel: { shrink: true } }}
          label="Name"
          name="name"
        />

        {/* Brand Field */}
        <TextField
          {...register("brand")}
          error={Boolean(errors.brand)}
          helperText={
            typeof errors.brand?.message === "string"
              ? errors.brand.message
              : ""
          }
          fullWidth
          slotProps={{ inputLabel: { shrink: true } }}
          label="Brand"
          name="brand"
        />

        {/* Description Field */}
        <TextField
          {...register("description")}
          error={Boolean(errors.description)}
          helperText={
            typeof errors.description?.message === "string"
              ? errors.description.message
              : ""
          }
          fullWidth
          slotProps={{ inputLabel: { shrink: true } }}
          label="Description"
          name="description"
        />

        {/* Barcode Field (read-only) */}
        <TextField
          {...register("barcode", { required: "Barcode is required" })}
          error={Boolean(errors.barcode)}
          helperText={
            typeof errors.barcode?.message === "string"
              ? errors.barcode.message
              : ""
          }
          fullWidth
          slotProps={{ inputLabel: { shrink: true } }}
          label="Barcode"
          name="barcode"
        />

        {/* Image URL Field */}
        <TextField
          {...register("image_url")}
          error={Boolean(errors.image_url)}
          helperText={
            typeof errors.image_url?.message === "string"
              ? errors.image_url.message
              : ""
          }
          fullWidth
          slotProps={{ inputLabel: { shrink: true } }}
          label="Image URL"
          name="image_url"
        />

        <BarcodeScannerFab onCapture={handleCapture} />
      </Box>
    </Create>
  );
};
