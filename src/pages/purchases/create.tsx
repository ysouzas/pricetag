import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Typography,
} from "@mui/material";
import { Create } from "@refinedev/mui";
import { useForm } from "@refinedev/react-hook-form";
import { useSelect, useList, HttpError } from "@refinedev/core";
import { Controller } from "react-hook-form";
import { BarcodeScannerFab } from "../../components/shared/barcodeScannerFab";

interface IProduct {
  id: string;
  name: string;
  barcode: string;
  // add additional fields as needed
}

interface IPurchaseForm {
  product_id: string;
  store_id: string;
  price: number;
  purchase_date: string;
  is_promotion: boolean;
}

export const PurchaseCreate: React.FC = () => {
  function getDatetimeLocal() {
    const now = new Date();
    now.setSeconds(0, 0); // remove seconds and milliseconds
    const offset = now.getTimezoneOffset();
    const localDate = new Date(now.getTime() - offset * 60 * 1000);
    return localDate.toISOString().slice(0, 16); // "YYYY-MM-DDTHH:MM"
  }

  const {
    saveButtonProps,
    refineCore: { formLoading },
    register,
    control,
    setValue,
    formState: { errors },
  } = useForm<IPurchaseForm>({
    defaultValues: {
      purchase_date: getDatetimeLocal(), // This will set the default value properly.
    },
  });

  // Fetch available stores for the dropdown.
  const { options: storeOptions } = useSelect({
    resource: "stores",
    optionLabel: "name",
    optionValue: "id",
  });

  // State to store the scanned barcode.
  const [scannedBarcode, setScannedBarcode] = useState<string>("");

  // Use useList to look up product by barcode.
  const { data: productListData } = useList<IProduct, HttpError>({
    resource: "products",
    filters: scannedBarcode
      ? [
          {
            field: "barcode",
            operator: "eq",
            value: scannedBarcode,
          },
        ]
      : [],
    queryOptions: {
      enabled: scannedBarcode !== "",
    },
  });

  // When a barcode is scanned and a product is found, set the product_id.
  useEffect(() => {
    if (scannedBarcode && productListData?.data) {
      if (productListData.data.length === 1) {
        const productId = productListData.data[0].id;
        setValue("product_id", productId, { shouldValidate: true });
        // Optionally, you can clear the scanned barcode state and close any scanner dialog.
      } else if (productListData.data.length === 0) {
        alert(`No product found with barcode: ${scannedBarcode}`);
      } else {
        alert(`Multiple products found with barcode: ${scannedBarcode}`);
      }
      // Reset the scanned barcode after handling.
      setScannedBarcode("");
    }
  }, [scannedBarcode, productListData, setValue]);

  // Handler for the barcode scanner.
  const handleCapture = (barcode: string): void => {
    setScannedBarcode(barcode);
    setValue("barcode", barcode, { shouldValidate: true });
  };

  return (
    <Create isLoading={formLoading} saveButtonProps={saveButtonProps}>
      <Box
        component="form"
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        autoComplete="off"
      >
        {/* Product ID Field (read-only) */}
        <TextField
          {...register("product_id", { required: "Product ID is required" })}
          error={!!errors.product_id}
          helperText={
            typeof errors.product_id?.message === "string"
              ? errors.product_id.message
              : ""
          }
          label="Product ID"
          name="product_id"
          fullWidth
          slotProps={{ inputLabel: { shrink: true } }}
        />

        {/* Store Dropdown */}
        <FormControl fullWidth margin="normal" error={!!errors.store_id}>
          <InputLabel id="store-select-label">Store</InputLabel>
          <Controller
            name="store_id"
            control={control}
            rules={{ required: "Store is required" }}
            render={({ field }) => (
              <Select {...field} labelId="store-select-label" label="Store">
                {storeOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
          {errors.store_id && (
            <Typography variant="caption" color="error">
              {typeof errors.store_id?.message === "string"
                ? errors.store_id.message
                : ""}
            </Typography>
          )}
        </FormControl>

        {/* Price Field */}
        <TextField
          {...register("price", { required: "Price is required" })}
          error={!!errors.price}
          helperText={
            typeof errors.price?.message === "string"
              ? errors.price.message
              : ""
          }
          label="Price"
          name="price"
          type="number"
          fullWidth
          slotProps={{ inputLabel: { shrink: true } }}
        />

        {/* Purchase Date Field */}
        <TextField
          {...register("purchase_date", {
            required: "Purchase Date is required",
          })}
          error={!!errors.purchase_date}
          helperText={
            typeof errors.purchase_date?.message === "string"
              ? errors.purchase_date.message
              : ""
          }
          label="Purchase Date"
          name="purchase_date"
          type="datetime-local"
          fullWidth
          slotProps={{ inputLabel: { shrink: true } }}
        />

        {/* Is Promotion Field */}
        <Controller
          name="is_promotion"
          control={control}
          defaultValue={false}
          render={({ field }) => (
            <FormControlLabel
              control={<Checkbox {...field} checked={field.value} />}
              label="Promotion"
            />
          )}
        />

        {/* Reusable Barcode Scanner FAB */}
        <BarcodeScannerFab onCapture={handleCapture} />
      </Box>
    </Create>
  );
};
