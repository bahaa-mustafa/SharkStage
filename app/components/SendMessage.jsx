import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export default function SendMessage({
  open,
  handleClose,
  handleSubmit,
  onSubmitLogic,
  children,
  messageLoading,
}) {
  return (
    <>
      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>Send a message</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmitLogic)} id="subscription-form">
            {children}
          </form>
        </DialogContent>
        <DialogActions>
          <button
            className="w-full  bg-background text-primary font-bold py-2 rounded-lg hover:shadow-lg transition-shadow "
            onClick={handleClose}
            disabled={messageLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            form="subscription-form"
            disabled={messageLoading}
            className="w-full justify-center py-2 bg-primary text-background font-bold rounded-lg hover:bg-secondary transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {messageLoading && <Loader2 size={16} className="animate-spin" />}
            {messageLoading ? "Sending..." : "Send"}
          </button>
        </DialogActions>
      </Dialog>
    </>
  );
}
