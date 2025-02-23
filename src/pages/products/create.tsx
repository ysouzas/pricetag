import React, { useState, useEffect, useCallback } from "react";
import { Box, TextField } from "@mui/material";
import { Create } from "@refinedev/mui";
import { useForm } from "@refinedev/react-hook-form";
import { BarcodeScannerFab } from "../../components/shared/barcodeScannerFab";

interface IProductForm {
  name: string;
  brand?: string;
  description?: string;
  barcode: string;
  image_url?: string;
}

const commonSlotProps = { inputLabel: { shrink: true } };

const getHelperText = (error: unknown): string =>
  typeof (error as { message?: string })?.message === "string"
    ? (error as { message: string }).message
    : "";

export const ProductCreate: React.FC = () => {
  const {
    saveButtonProps,
    refineCore: { formLoading },
    register,
    setValue,
    formState: { errors },
  } = useForm<IProductForm>();

  // State to store the scanned barcode.
  const [scannedBarcode, setScannedBarcode] = useState<string>("");

  // Callback when a barcode is captured.
  const handleCapture = useCallback(
    (barcode: string): void => {
      setScannedBarcode(barcode);
      setValue("barcode", barcode, { shouldValidate: true });
    },
    [setValue]
  );

  const updateValue = (predicate: any, value: any) => {
    if (predicate) {
      setValue(value, predicate, {
        shouldValidate: true,
      });
    } else {
      console.error(`No ${value} available`);
    }
  };

  // Fetch product details from the external API when a barcode is captured.
  useEffect(() => {
    if (!scannedBarcode) return;

    const apiUrl = `https://pt.openfoodfacts.org/api/v0/product/${scannedBarcode}.json`;

    fetch(apiUrl)
      .then((res) => res.json())
      .then((json) => {
        if (json.status === 1 && json.product) {
          updateValue(json.product.image_front_url, "image_url");
          updateValue(json.product.brands, "brand");
          updateValue(
            json.product.product_name_pt || json.product.product_name,
            "name"
          );
          updateValue(json.product.image_front_url, "image_url");

          if (json.product.generic_name_pt || json.product.generic_name) {
            setValue(
              "description",
              json.product.generic_name_pt || json.product.generic_name,
              { shouldValidate: true }
            );
          } else {
            if (json.product.categories || json.product.categories_old) {
              setValue(
                "description",
                json.product.categories || json.product.categories_old,
                { shouldValidate: true }
              );
            }
            console.error("No product name available", json);
          }
        } else {
          console.error("Product not found", json);
        }
      })
      .catch((error) =>
        console.error("Error fetching product details:", error)
      );
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
          helperText={getHelperText(errors.name)}
          fullWidth
          slotProps={commonSlotProps}
          label="Name"
          name="name"
        />

        {/* Brand Field */}
        <TextField
          {...register("brand")}
          error={Boolean(errors.brand)}
          helperText={getHelperText(errors.brand)}
          fullWidth
          slotProps={commonSlotProps}
          label="Brand"
          name="brand"
        />

        {/* Description Field */}
        <TextField
          {...register("description")}
          error={Boolean(errors.description)}
          helperText={getHelperText(errors.description)}
          fullWidth
          slotProps={commonSlotProps}
          label="Description"
          name="description"
        />

        {/* Barcode Field (read-only) */}
        <TextField
          {...register("barcode", { required: "Barcode is required" })}
          error={Boolean(errors.barcode)}
          helperText={getHelperText(errors.barcode)}
          fullWidth
          slotProps={commonSlotProps}
          label="Barcode"
          name="barcode"
          inputProps={{ readOnly: true }}
        />

        {/* Image URL Field */}
        <TextField
          {...register("image_url")}
          error={Boolean(errors.image_url)}
          helperText={getHelperText(errors.image_url)}
          fullWidth
          slotProps={commonSlotProps}
          label="Image URL"
          name="image_url"
        />
      </Box>

      {/* Reusable Barcode Scanner FAB */}
      <BarcodeScannerFab onCapture={handleCapture} />
    </Create>
  );
};
