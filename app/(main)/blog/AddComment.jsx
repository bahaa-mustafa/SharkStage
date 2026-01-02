import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Loader2 } from "lucide-react";

export default function AddComment({
  open,
  handleClose,
  handleSubmit,
  onSubmitLogic,
  children,
  postLoading,
  title,
  buttonText = "Add",
}) {
  return (
    <>
      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle className="dark:bg-background-dark dark:text-background">
          {title}
        </DialogTitle>
        <DialogContent className="dark:bg-background-dark">
          <form
            onSubmit={handleSubmit(onSubmitLogic)}
            id="subscription-form"
            className="space-y-4"
          >
            {children}
          </form>
        </DialogContent>
        <DialogActions className="dark:bg-background-dark">
          <button
            className="w-full  bg-background dark:bg-background/75 hover:dark:bg-background/45 text-primary dark:text-heading font-bold py-2 rounded-lg hover:shadow-lg transition-shadow "
            onClick={handleClose}
            disabled={postLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            form="subscription-form"
            disabled={postLoading}
            className="w-full justify-center py-2 bg-primary text-background font-bold rounded-lg hover:bg-secondary hover:dark:bg-heading transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {postLoading && <Loader2 size={16} className="animate-spin" />}
            {postLoading ? `${buttonText}ing...` : buttonText}
          </button>
        </DialogActions>
      </Dialog>
    </>
  );
}
