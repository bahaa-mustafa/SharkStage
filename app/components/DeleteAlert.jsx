"use client";
import { Trash2 } from "lucide-react";
import CustomAlert from "./Alert";
import { useState } from "react";

function DeleteAlert({ handleDelete, deleteLoading, title, className }) {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  return (
    <>
      <button
        className={`${
          className || "text-red-700"
        } rounded-lg hover:bg-black/10 p-2 transition-colors`}
        onClick={handleClickOpen}
      >
        <Trash2 />
      </button>
      <CustomAlert
        open={open}
        setOpen={setOpen}
        handleDelete={handleDelete}
        loading={deleteLoading}
        title={title}
      />
    </>
  );
}

export default DeleteAlert;
