import { Box, Button } from "@mui/material";
import { GridToolbar } from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";

export const CustomToolbar: React.FC<any> = ({ onAddClick, label, ...props }) => {
  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 1 }}>
      <Button variant="outlined" color="primary" startIcon={<AddIcon />} onClick={onAddClick}>
        Agregar {label}
      </Button>
      <GridToolbar />
    </Box>
  );
};
