import { Stack, Typography, Box } from "@mui/material";
import { useShow, useList, useSelect } from "@refinedev/core";
import { Show, TextFieldComponent as TextField } from "@refinedev/mui";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";

export const ProductShow = () => {
  const { query } = useShow({});
  const { data, isLoading } = query;
  const record = data?.data;

  // Fetch purchases related to this product
  const { data: purchasesData, isLoading: purchasesLoading } = useList({
    resource: "purchases",
    filters: [{ field: "product_id", operator: "eq", value: record?.id }],
    queryOptions: { enabled: !!record },
  });

  // Fetch store options so we can look up the store name based on store_id
  const { options: storeOptions } = useSelect({
    resource: "stores",
    optionLabel: "name",
    optionValue: "id",
  });

  // Define columns for the purchases table
  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "ID",
      minWidth: 50,
      headerAlign: "left",
      align: "left",
    },
    {
      field: "store",
      headerName: "Store",
      flex: 1,
      minWidth: 150,
      renderCell: ({ row }) => {
        const storeOption = storeOptions.find(
          (option) => option.value === row.store_id
        );
        return storeOption ? storeOption.label : "N/A";
      },
    },
    {
      field: "price",
      headerName: "Price",
      flex: 1,
      minWidth: 100,
      renderCell: ({ row }) => `$${row.price}`,
    },
    {
      field: "purchase_date",
      headerName: "Purchase Date",
      flex: 1,
      minWidth: 150,
      renderCell: ({ row }) =>
        row.purchase_date
          ? new Date(row.purchase_date).toLocaleDateString()
          : "",
    },
    {
      field: "is_promotion",
      headerName: "Promotion",
      flex: 1,
      minWidth: 100,
      renderCell: ({ row }) => (row.is_promotion ? "Yes" : "No"),
    },
  ];

  return (
    <Show isLoading={isLoading}>
      <Stack gap={2}>
        {/* Product Details */}
        <Typography variant="body1" fontWeight="bold">
          ID
        </Typography>
        <TextField value={record?.id} />

        <Typography variant="body1" fontWeight="bold">
          Name
        </Typography>
        <TextField value={record?.name} />

        <Typography variant="body1" fontWeight="bold">
          Brand
        </Typography>
        <TextField value={record?.brand} />

        <Typography variant="body1" fontWeight="bold">
          Description
        </Typography>
        <TextField value={record?.description} />

        <Typography variant="body1" fontWeight="bold">
          Barcode
        </Typography>
        <TextField value={record?.barcode} />

        <Typography variant="body1" fontWeight="bold">
          Insert Date
        </Typography>
        <TextField value={record?.insert_date} />

        <Typography variant="body1" fontWeight="bold">
          Image
        </Typography>
        {record?.image_url ? (
          <img
            src={record.image_url}
            alt="Product"
            style={{ maxWidth: "300px", width: "100%", height: "auto" }}
          />
        ) : (
          <Typography>No image available</Typography>
        )}

        {/* Purchases Table */}
        <Typography variant="h6" sx={{ mt: 4 }}>
          Purchases
        </Typography>
        <Box sx={{ height: 400, width: "100%" }}>
          <DataGrid
            loading={purchasesLoading}
            rows={purchasesData?.data || []}
            columns={columns}
            getRowId={(row) => row.id}
            pageSize={5}
            rowsPerPageOptions={[5, 10]}
          />
        </Box>
      </Stack>
    </Show>
  );
};
