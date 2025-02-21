import { useState } from "react";
import { Box, TextField, Button } from "@mui/material";
import { Create } from "@refinedev/mui";
import { useForm } from "@refinedev/react-hook-form";
import { BarcodeScanner } from "react-barcode-scanner";

export const ProductCreate = () => {
  const {
    saveButtonProps,
    refineCore: { formLoading },
    register,
    setValue,
    formState: { errors },
  } = useForm();

  // Toggle scanner view
  const [scanning, setScanning] = useState(false);
  // For demonstration, assume the device supports torch
  const [torchEnabled, setTorchEnabled] = useState(false);
  const isSupportTorch = true;

  const onTorchSwitch = () => {
    setTorchEnabled((prev) => !prev);
    // Integrate with your scanner's torch API if available
  };

  // onCapture receives an array of DetectedBarcode objects
  const handleCapture = (barcodes: any[]) => {
    if (barcodes.length > 0) {
      // Assuming each DetectedBarcode has a 'text' property or a 'getText()' method.
      const scannedBarcode =
        typeof barcodes[0].getText === "function"
          ? barcodes[0].getText()
          : barcodes[0].text;
      setValue("barcode", scannedBarcode, { shouldValidate: true });
      setScanning(false);
    }
  };

  return (
    <Create isLoading={formLoading} saveButtonProps={saveButtonProps}>
      <Box
        component="form"
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        autoComplete="off"
      >
        <TextField
          {...register("name", { required: "This field is required" })}
          error={!!errors.name}
          helperText={errors.name?.message ? String(errors.name?.message) : ""}
          fullWidth
          slotProps={{ inputLabel: { shrink: true } }}
          label="Name"
          name="name"
        />
        <TextField
          {...register("brand")}
          error={!!errors.brand}
          helperText={
            errors.brand?.message ? String(errors.brand?.message) : ""
          }
          fullWidth
          slotProps={{ inputLabel: { shrink: true } }}
          label="Brand"
          name="brand"
        />
        <TextField
          {...register("description")}
          error={!!errors.description}
          helperText={
            errors.description?.message
              ? String(errors.description?.message)
              : ""
          }
          fullWidth
          slotProps={{ inputLabel: { shrink: true } }}
          label="Description"
          name="description"
        />
        <TextField
          {...register("barcode")}
          error={!!errors.barcode}
          helperText={
            errors.barcode?.message ? String(errors.barcode?.message) : ""
          }
          fullWidth
          slotProps={{ inputLabel: { shrink: true } }}
          label="Barcode"
          name="barcode"
          inputProps={{ readOnly: true }}
        />
        <Button variant="contained" onClick={() => setScanning(true)}>
          Scan Barcode
        </Button>
        {scanning && (
          <div style={{ width: "100%", height: "360px" }}>
            <BarcodeScanner onCapture={handleCapture} />
            {isSupportTorch ? (
              <Button onClick={onTorchSwitch} variant="outlined">
                Switch Torch {torchEnabled ? "(On)" : "(Off)"}
              </Button>
            ) : null}
          </div>
        )}
        <TextField
          {...register("image_url")}
          error={!!errors.image_url}
          helperText={
            errors.image_url?.message ? String(errors.image_url?.message) : ""
          }
          fullWidth
          slotProps={{ inputLabel: { shrink: true } }}
          label="Image URL"
          name="image_url"
        />
      </Box>
    </Create>
  );
};
