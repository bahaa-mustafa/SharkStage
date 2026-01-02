"use client";
import InputField from "@/app/components/InputField";
import SendMessage from "@/app/components/SendMessage";
import api from "@/lib/axios";
import { Chat } from "@mui/icons-material";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";

function MessageForm({ owner }) {
  const [messageLoading, setMessageLoading] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      content: "",
    },
  });

  const [open, setOpen] = useState(false);
  const onSubmitLogic = async (data) => {
    setMessageLoading(true);
    try {
      const cleanedData = {
        content: data.content,
        receiverId: owner,
      };
      await api.post("/chat/send", cleanedData);
      toast.success("Message sent successfully");
      reset();
      handleClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send message");
    } finally {
      setMessageLoading(false);
    }
  };
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    reset();
  };

  return (
    <>
      <button
        onClick={handleClickOpen}
        className="flex gap-2 self-center text-primary my-2 bg-background/80 cursor-pointer backdrop-blur-sm px-6 py-3 rounded-lg shadow-lg hover:shadow-black/20  transition"
      >
        <Chat />
        <span>Send Message</span>
      </button>
      <SendMessage
        handleClickOpen={handleClickOpen}
        handleClose={handleClose}
        onSubmitLogic={onSubmitLogic}
        handleSubmit={handleSubmit}
        messageLoading={messageLoading}
        open={open}
      >
        <Controller
          name="content"
          control={control}
          rules={{ required: "Text is required" }}
          render={({ field }) => (
            <InputField
              label="Message Content"
              error={errors.content?.message}
              required
            >
              <textarea
                {...field}
                rows={5}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none"
                placeholder="Say hi"
              />
            </InputField>
          )}
        />
      </SendMessage>
    </>
  );
}

export default MessageForm;
