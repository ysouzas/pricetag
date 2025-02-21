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
import { Edit } from "@refinedev/mui";
import { useForm } from "@refinedev/react-hook-form";
import { useSelect } from "@refinedev/core"; // Updated import
import { Controller } from "react-hook-form";

export const PurchaseEdit = () => {
  const {
    saveButtonProps,
    register,
    control,
    formState: { errors },
  } = useForm();

  // Fetch available stores for the dropdown.
  const { options: storeOptions } = useSelect({
    resource: "stores",
    optionLabel: "name",
    optionValue: "id",
  });

  return (
    <Edit saveButtonProps={saveButtonProps}>
      <Box
        component="form"
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        autoComplete="off"
      >
        {/* Product ID */}
        <TextField
          {...register("product_id", { required: "Product ID is required" })}
          error={!!errors.product_id}
          helperText={
            errors.product_id?.message ? String(errors.product_id?.message) : ""
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
              {String(errors.store_id?.message)}
            </Typography>
          )}
        </FormControl>

        {/* Price */}
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

        {/* Purchase Date */}
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
    </Edit>
  );
};
