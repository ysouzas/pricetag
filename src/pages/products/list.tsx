import React, { useState, useEffect } from "react";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import {
  List,
  DeleteButton,
  EditButton,
  ShowButton,
  useDataGrid,
} from "@refinedev/mui";
import { Fab, Dialog, DialogTitle, DialogContent } from "@mui/material";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import { useList, useNavigation, HttpError } from "@refinedev/core";

// Define an interface for your product data.
interface IProduct {
  id: string;
  name: string;
  barcode: string;
  // Include any other fields your product may have.
}

export const ProductList: React.FC = () => {
  const { dataGridProps } = useDataGrid();
  const { push } = useNavigation();

  // State for controlling the barcode scanner dialog and storing the scanned barcode.
  const [scanning, setScanning] = useState<boolean>(false);
  const [scannedBarcode, setScannedBarcode] = useState<string>("");

  // Use useList to query products by barcode when one is scanned.
  const { data: productsData, isLoading: listLoading } = useList<
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

  // When scannedBarcode changes and the list returns data, handle the result.
  useEffect(() => {
    if (scannedBarcode && productsData?.data) {
      if (productsData.data.length === 1) {
        // Found exactly one product; redirect to its show page.
        const productId = productsData.data[0].id;
        push(`/products/show/${productId}`);
      } else if (productsData.data.length === 0) {
        alert(`No product found with barcode: ${scannedBarcode}`);
      } else {
        alert(`Multiple products found with barcode: ${scannedBarcode}`);
      }
      setScannedBarcode("");
      setScanning(false);
    }
  }, [scannedBarcode, productsData, push]);

  // When a barcode is captured from the scanner, store it.
  const handleCapture = (barcode: string): void => {
    setScannedBarcode(barcode);
  };

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "ID",
      minWidth: 50,
      headerAlign: "left",
      align: "left",
    },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      minWidth: 150,
    },
    {
      field: "barcode",
      headerName: "Barcode",
      flex: 1,
      minWidth: 150,
    },
    {
      field: "actions",
      headerName: "Actions",
      minWidth: 150,
      sortable: false,
      renderCell: ({ row }) => (
        <>
          <EditButton hideText recordItemId={row.id} />
          <ShowButton hideText recordItemId={row.id} />
          <DeleteButton hideText recordItemId={row.id} />
        </>
      ),
    },
  ];

  return (
    <>
      <List>
        <DataGrid
          {...dataGridProps}
          columns={columns}
          getRowId={(row) => row.id}
        />
      </List>

      {/* Floating Action Button to trigger barcode scanning */}
      <Fab
        color="primary"
        aria-label="scan"
        onClick={() => setScanning(true)}
        style={{ position: "fixed", bottom: 16, right: 16 }}
      >
        <CameraAltIcon />
      </Fab>

      {/* Dialog containing the barcode scanner */}
      <Dialog
        open={scanning}
        onClose={() => {
          setScanning(false);
        }}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Scan Barcode</DialogTitle>
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
    </>
  );
};
