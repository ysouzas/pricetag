import { Stack, Typography, Box } from "@mui/material";
import { useOne, useShow } from "@refinedev/core";
import { Show, TextFieldComponent as TextField } from "@refinedev/mui";

export const PurchaseShow = () => {
  const { query } = useShow({});
  const { data, isLoading } = query;
  const record = data?.data;

  // Fetch full product record by product_id
  const { data: dataProductOne } = useOne({
    resource: "products",
    id: record?.product_id,
  });

  // Fetch full store record by store_id
  const { data: dataStoreOne } = useOne({
    resource: "stores",
    id: record?.store_id,
  });

  // Extract product details
  const productName = dataProductOne?.data?.name || "N/A";
  const productImage = dataProductOne?.data?.image_url || "";

  // Extract store details
  const storeName = dataStoreOne?.data?.name || "N/A";
  const storeImage = dataStoreOne?.data?.image_url || "";

  return (
    <Show isLoading={isLoading}>
      <Stack gap={2}>
        <Typography variant="h6">ID</Typography>
        <TextField value={record?.id} />

        <Typography variant="h6">Product</Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <TextField value={productName} />
          {productImage ? (
            <img
              src={productImage}
              alt="Product"
              style={{
                maxWidth: "100px",
                maxHeight: "100px",
                objectFit: "cover",
              }}
            />
          ) : (
            <Typography variant="caption">
              No product image available
            </Typography>
          )}
        </Box>

        <Typography variant="h6">Store</Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <TextField value={storeName} />
          {storeImage ? (
            <img
              src={storeImage}
              alt="Store"
              style={{
                maxWidth: "100px",
                maxHeight: "100px",
                objectFit: "cover",
              }}
            />
          ) : (
            <Typography variant="caption">No store image available</Typography>
          )}
        </Box>

        <Typography variant="h6">Price</Typography>
        <TextField value={`$${record?.price}`} />

        <Typography variant="h6">Purchase Date</Typography>
        <TextField
          value={
            record?.purchase_date
              ? new Date(record.purchase_date).toLocaleString()
              : ""
          }
        />

        <Typography variant="h6">Promotion</Typography>
        <TextField value={record?.is_promotion ? "Yes" : "No"} />
      </Stack>
    </Show>
  );
};
