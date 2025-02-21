import { Box, TextField } from "@mui/material";
import { Edit } from "@refinedev/mui";
import { useForm } from "@refinedev/react-hook-form";

export const ProductEdit = () => {
  const {
    saveButtonProps,
    register,
    formState: { errors },
  } = useForm();

  return (
    <Edit saveButtonProps={saveButtonProps}>
      <Box
        component="form"
        sx={{ display: "flex", flexDirection: "column" }}
        autoComplete="off"
      >
        <TextField
          {...register("name", { required: "This field is required" })}
          error={!!errors.name}
          helperText={errors.name?.message ? String(errors.name?.message) : ""}
          margin="normal"
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
          margin="normal"
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
          margin="normal"
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
          margin="normal"
          fullWidth
          slotProps={{ inputLabel: { shrink: true } }}
          label="Barcode"
          name="barcode"
        />
        <TextField
          {...register("image_url")}
          error={!!errors.image_url}
          helperText={
            errors.image_url?.message ? String(errors.image_url?.message) : ""
          }
          margin="normal"
          fullWidth
          slotProps={{ inputLabel: { shrink: true } }}
          label="Image URL"
          name="image_url"
        />
      </Box>
    </Edit>
  );
};
