"use client";
import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { X, Image as ImageIcon } from "lucide-react";
import AddComment from "@/app/(main)/blog/AddComment";
import InputField from "../InputField";

export default function EditPostModal({ isOpen, onClose, post, onUpdate }) {
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      content: "",
    },
  });

  useEffect(() => {
    if (post && isOpen) {
      reset({
        title: post.title,
        content: post.content,
      });
      setImagePreview(post.imageUrl || null);
      setImageFile(null);
      setRemoveImage(false);
    }
  }, [post, isOpen, reset]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB");
        return;
      }
      if (!file.type.startsWith("image/")) {
        alert("Only image files are allowed");
        return;
      }
      setImageFile(file);
      setRemoveImage(false);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setRemoveImage(true);
  };

  const handleClose = () => {
    onClose();
    reset();
    setImagePreview(null);
    setImageFile(null);
    setRemoveImage(false);
  };

  const onSubmit = async (data) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("content", data.content);

    if (removeImage) {
      formData.append("removeImage", "true");
    }

    if (imageFile) {
      formData.append("image", imageFile);
    }

    await onUpdate(formData);
    setLoading(false);
    handleClose();
  };

  return (
    <AddComment
      open={isOpen}
      handleClose={handleClose}
      handleSubmit={handleSubmit}
      onSubmitLogic={onSubmit}
      postLoading={loading}
      title="Edit Post"
      buttonText="Update"
    >
      <Controller
        name="title"
        control={control}
        rules={{ required: "Title is required" }}
        render={({ field }) => (
          <InputField label="Post Title" error={errors.title?.message} required>
            <input
              {...field}
              type="text"
              className="w-full dark:placeholder-background/30 px-3 py-2 border border-gray-300 dark:border-0 dark:bg-background/10 dark:text-background rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              placeholder="Title"
            />
          </InputField>
        )}
      />

      <Controller
        name="content"
        control={control}
        rules={{ required: "Content is required" }}
        render={({ field }) => (
          <InputField label="Content" error={errors.content?.message} required>
            <textarea
              {...field}
              rows={5}
              className="w-full dark:placeholder-background/30 px-3 py-2 border border-gray-300 dark:border-0 dark:bg-background/10 dark:text-background rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none"
              placeholder="Content"
            />
          </InputField>
        )}
      />

      {/* Image Upload/Edit */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-background">
          Image (Optional)
        </label>

        {imagePreview ? (
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full h-48 object-cover rounded-lg"
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 dark:border-background/20 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-background/10 hover:bg-gray-100 dark:hover:bg-background/20 transition-colors">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <ImageIcon className="w-8 h-8 mb-2 text-gray-400 dark:text-paragraph" />
              <p className="text-sm text-gray-500 dark:text-paragraph">
                <span className="font-semibold">Click to upload</span> or drag
                and drop
              </p>
              <p className="text-xs text-gray-500 dark:text-paragraph">
                PNG, JPG up to 5MB
              </p>
            </div>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleImageChange}
            />
          </label>
        )}
      </div>
    </AddComment>
  );
}
