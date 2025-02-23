import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import BarcodeScannerComponent from "react-qr-barcode-scanner";

interface BarcodeScannerDialogProps {
  open: boolean;
  onClose: () => void;
  onCapture: (barcode: string) => void;
}

export const BarcodeScannerDialog: React.FC<BarcodeScannerDialogProps> = ({
  open,
  onClose,
  onCapture,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Set dimensions based on the viewport size.
  const scannerWidth = isMobile ? 300 : 500;
  const scannerHeight = isMobile ? 300 : 500;
  const containerHeight = isMobile ? "300px" : "360px";

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Scan Product Barcode</DialogTitle>
      <DialogContent>
        <div style={{ width: "100%", height: containerHeight }}>
          <BarcodeScannerComponent
            width={scannerWidth}
            height={scannerHeight}
            onUpdate={(err: unknown, result?: { getText: () => string }) => {
              if (result) onCapture(result.getText());
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
