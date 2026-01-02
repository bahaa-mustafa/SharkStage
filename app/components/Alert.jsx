import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { Loader2 } from "lucide-react";

export default function CustomAlert({
  title,
  loading,
  handleDelete,
  open,
  setOpen,
}) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog
      fullScreen={fullScreen}
      open={open}
      onClose={handleClose}
      aria-labelledby="responsive-dialog-title"
    >
      <DialogTitle id="responsive-dialog-title">{title}</DialogTitle>

      <DialogActions>
        <Button autoFocus onClick={handleClose}>
          Cancel
        </Button>
        <button
          onClick={() => {
            handleDelete();
            handleClose();
          }}
          disabled={loading}
          className="flex-1 px-3 py-2 flex items-center justify-center border disabled:opacity-50 disabled:cursor-not-allowed bg-red-700 text-white rounded-lg hover:bg-red-50 hover:text-red-700 transition text-sm font-medium"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : "Delete"}
        </button>
      </DialogActions>
    </Dialog>
  );
}
