import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Loader2 } from "lucide-react";

export default function DialogWindow({
  open,
  handleClose,
  handleSubmit,
  onSubmitLogic,
  children,
  offerLoading,
}) {
  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Send an Investment Offer</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please specify your proposed investment amount, percentage, and a
            short proposal to the project owner.
          </DialogContentText>
          <form onSubmit={handleSubmit(onSubmitLogic)} id="subscription-form">
            {children}
          </form>
        </DialogContent>
        <DialogActions>
          <button
            className="w-full  bg-background text-primary font-bold py-2 rounded-lg hover:shadow-lg transition-shadow "
            onClick={handleClose}
            disabled={offerLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            form="subscription-form"
            disabled={offerLoading}
            className="w-full justify-center py-2 bg-primary text-background font-bold rounded-lg hover:bg-secondary transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {offerLoading && <Loader2 size={16} className="animate-spin" />}
            {offerLoading ? "Sending..." : "Send"}
          </button>
        </DialogActions>
      </Dialog>
    </>
  );
}
