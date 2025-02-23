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
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import { Create } from "@refinedev/mui";
import { useForm } from "@refinedev/react-hook-form";
import { useSelect, useList, useNavigation, HttpError } from "@refinedev/core";
import { Controller } from "react-hook-form";
import BarcodeScannerComponent from "react-qr-barcode-scanner";

// Define an interface for your product data
interface IProduct {
  id: string;
  name: string;
  barcode: string;
  // add additional fields as needed
}

// Define an interface for the purchase form data.
interface IPurchaseForm {
  product_id: string;
  store_id: string;
  price: number;
  purchase_date: string;
  is_promotion: boolean;
}

export const PurchaseCreate: React.FC = () => {
  const {
    saveButtonProps,
    refineCore: { formLoading },
    register,
    control,
    setValue,
    formState: { errors },
  } = useForm<IPurchaseForm>();

  // Fetch available stores for the dropdown.
  const { options: storeOptions } = useSelect({
    resource: "stores",
    optionLabel: "name",
    optionValue: "id",
  });

  // State to control barcode scanner dialog and store scanned barcode text.
  const [scanning, setScanning] = useState<boolean>(false);
  const [scannedBarcode, setScannedBarcode] = useState<string>("");

  // Use useList to look up product by barcode.
  const { data: productListData, isLoading: productListLoading } = useList<
    IProduct,
    HttpError
  >({
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

  const { push } = useNavigation();

  // When a barcode is scanned and a product is found, set the product_id.
  useEffect(() => {
    if (scannedBarcode && productListData?.data) {
      if (productListData.data.length === 1) {
        const productId = productListData.data[0].id;
        setValue("product_id", productId, { shouldValidate: true });
        // Optionally, close the scanner dialog if still open.
        setScanning(false);
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
  };

  return (
    <Create isLoading={formLoading} saveButtonProps={saveButtonProps}>
      <Box
        component="form"
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        autoComplete="off"
      >
        {/* Product ID Field */}
        <TextField
          {...register("product_id", { required: "Product ID is required" })}
          error={!!errors.product_id}
          helperText={
            errors.product_id?.message ? String(errors.product_id.message) : ""
          }
          label="Product ID"
          name="product_id"
          fullWidth
          slotProps={{ inputLabel: { shrink: true } }}
          inputProps={{ readOnly: true }}
        />

        {/* Button to trigger barcode scanner */}
        <Fab
          color="primary"
          aria-label="scan"
          onClick={() => setScanning(true)}
          style={{ alignSelf: "flex-end", marginBottom: 16 }}
        >
          <CameraAltIcon />
        </Fab>

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
              {String(errors.store_id?.message)}
            </Typography>
          )}
        </FormControl>

        {/* Price Field */}
        <TextField
          {...register("price", { required: "Price is required" })}
          error={!!errors.price}
          helperText={
            errors.price?.message ? String(errors.price?.message) : ""
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
            errors.purchase_date?.message
              ? String(errors.purchase_date?.message)
              : ""
          }
          label="Purchase Date"
          name="purchase_date"
          type="datetime-local"
          fullWidth
          slotProps={{ inputLabel: { shrink: true } }}
        />

        {/* Is Promotion */}
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
      </Box>

      {/* Barcode Scanner Dialog */}
      <Dialog
        open={scanning}
        onClose={() => setScanning(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Scan Product Barcode</DialogTitle>
        <DialogContent>
          <div style={{ width: "100%", height: "360px" }}>
            <BarcodeScannerComponent
              width={500}
              height={500}
              onUpdate={(err, result) => {
                if (result) handleCapture(result.getText());
              }}
            />
          </div>
        </DialogContent>
      </Dialog>
    </Create>
  );
};
