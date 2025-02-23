import React, { useState } from "react";
import { Fab } from "@mui/material";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import { BarcodeScannerDialog } from "../barcodeScannerDialog";

interface BarcodeScannerFabProps {
  onCapture: (barcode: string) => void;
}

export const BarcodeScannerFab: React.FC<BarcodeScannerFabProps> = ({
  onCapture,
}) => {
  const [open, setOpen] = useState<boolean>(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleUpdate = (err: unknown, result?: { getText: () => string }) => {
    if (result) {
      onCapture(result.getText());
      handleClose();
    }
  };

  return (
    <>
      <Fab
        color="primary"
        aria-label="scan"
        onClick={handleOpen}
        style={{ position: "fixed", bottom: 16, right: 16 }}
      >
        <CameraAltIcon />
      </Fab>

      <BarcodeScannerDialog
        open={open}
        onClose={handleClose}
        onCapture={handleUpdate}
      />
    </>
  );
};
