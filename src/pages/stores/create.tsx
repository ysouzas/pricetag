import { Box, TextField } from "@mui/material";
import { Create } from "@refinedev/mui";
import { useForm } from "@refinedev/react-hook-form";

export const StoreCreate = () => {
  const {
    saveButtonProps,
    refineCore: { formLoading },
    register,
    formState: { errors },
  } = useForm();

  return (
    <Create isLoading={formLoading} saveButtonProps={saveButtonProps}>
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
    </Create>
  );
};
