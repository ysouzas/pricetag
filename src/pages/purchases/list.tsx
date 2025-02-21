import React from "react";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import {
  DeleteButton,
  EditButton,
  List,
  ShowButton,
  useDataGrid,
} from "@refinedev/mui";
import { useSelect } from "@refinedev/core";

export const PurchaseList = () => {
  const { dataGridProps } = useDataGrid({});

  // Fetch options for products and stores
  const { options: productOptions } = useSelect({
    resource: "products",
    optionLabel: "name",
    optionValue: "id",
  });

  const { options: storeOptions } = useSelect({
    resource: "stores",
    optionLabel: "name",
    optionValue: "id",
  });

  const columns = React.useMemo<GridColDef[]>(
    () => [
      {
        field: "id",
        headerName: "ID",
        minWidth: 50,
        align: "left",
        headerAlign: "left",
      },
      {
        field: "product",
        headerName: "Product",
        flex: 1,
        minWidth: 150,
        renderCell: ({ row }) => {
          // Prefer joined relation if available
          if (row.product && row.product.name) {
            return row.product.name;
          }
          // Otherwise, use the lookup
          const found = productOptions.find(
            (option) => option.value === row.product_id
          );
          return found ? found.label : "N/A";
        },
      },
      {
        field: "store",
        headerName: "Store",
        flex: 1,
        minWidth: 150,
        renderCell: ({ row }) => {
          // Prefer joined relation if available
          if (row.store && row.store.name) {
            return row.store.name;
          }
          // Otherwise, use the lookup
          const found = storeOptions.find(
            (option) => option.value === row.store_id
          );
          return found ? found.label : "N/A";
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
          row.purchase_date ? new Date(row.purchase_date).toLocaleString() : "",
      },
      {
        field: "is_promotion",
        headerName: "Promotion",
        flex: 1,
        minWidth: 100,
        renderCell: ({ row }) => (row.is_promotion ? "Yes" : "No"),
      },
      {
        field: "actions",
        headerName: "Actions",
        align: "right",
        headerAlign: "right",
        minWidth: 120,
        sortable: false,
        renderCell: ({ row }) => (
          <>
            <EditButton hideText recordItemId={row.id} />
            <ShowButton hideText recordItemId={row.id} />
            <DeleteButton hideText recordItemId={row.id} />
          </>
        ),
      },
    ],
    [productOptions, storeOptions]
  );

  return (
    <List>
      <DataGrid {...dataGridProps} columns={columns} />
    </List>
  );
};
