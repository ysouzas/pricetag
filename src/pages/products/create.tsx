import React, { useState } from "react";
import { Box, TextField, Button } from "@mui/material";
import { Create } from "@refinedev/mui";
import { useForm } from "@refinedev/react-hook-form";
import BarcodeScannerComponent from "react-qr-barcode-scanner";

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

  const [scanning, setScanning] = useState<boolean>(false);

  const handleCapture = (barcode: string): void => {
    setValue("barcode", barcode, { shouldValidate: true });
    setScanning(false);
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
          error={Boolean(errors.name)}
          helperText={errors.name?.message ? String(errors.name.message) : ""}
          fullWidth
          slotProps={{ inputLabel: { shrink: true } }}
          label="Name"
          name="name"
        />
        <TextField
          {...register("brand")}
          error={Boolean(errors.brand)}
          helperText={errors.brand?.message ? String(errors.brand.message) : ""}
          fullWidth
          slotProps={{ inputLabel: { shrink: true } }}
          label="Brand"
          name="brand"
        />
        <TextField
          {...register("description")}
          error={Boolean(errors.description)}
          helperText={
            errors.description?.message
              ? String(errors.description.message)
              : ""
          }
          fullWidth
          slotProps={{ inputLabel: { shrink: true } }}
          label="Description"
          name="description"
        />
        <TextField
          {...register("barcode")}
          error={Boolean(errors.barcode)}
          helperText={
            errors.barcode?.message ? String(errors.barcode.message) : ""
          }
          fullWidth
          slotProps={{ inputLabel: { shrink: true } }}
          label="Barcode"
          name="barcode"
        />
        <Button variant="contained" onClick={() => setScanning(true)}>
          Scan Barcode
        </Button>
        {scanning && (
          <div style={{ width: "100%", height: "360px" }}>
            <BarcodeScannerComponent
              width={500}
              height={500}
              onUpdate={(err, result) => {
                if (result) handleCapture(result.getText());
              }}
            />
          </div>
        )}
        <TextField
          {...register("image_url")}
          error={Boolean(errors.image_url)}
          helperText={
            errors.image_url?.message ? String(errors.image_url.message) : ""
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
