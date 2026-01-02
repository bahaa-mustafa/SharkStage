import { Upload, X } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";

const PROJECT_CATEGORIES = [
  "Technology",
  "E-Commerce",
  "Food",
  "Health",
  "Education",
  "Real Estate",
  "Industrial",
  "Other",
];

export default function BasicInfoStep({
  formData,
  updateFormData,
  isEdit = false,
}) {
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Image size should be less than 10MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        updateFormData({
          imageFile: file,
          imagePreview: reader.result,
          existingImage: null, // Clear existing image when new one is selected
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    updateFormData({
      imageFile: null,
      imagePreview: null,
    });
  };

  const removeExistingImage = () => {
    updateFormData({
      existingImage: null,
    });
  };

  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-bold text-heading dark:text-background mb-4">
        Basic Information
      </h2>

      {/* Image Upload */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-heading dark:text-background">
          Project Image
        </label>

        {/* Show existing image (edit mode) */}
        {isEdit && formData.existingImage && !formData.imagePreview && (
          <div className="relative rounded-lg overflow-hidden border border-gray-300 dark:border-0">
            <Image
              src={formData.existingImage}
              alt="Current project image"
              width={800}
              height={400}
              className="w-full h-64 object-cover"
            />
            <button
              type="button"
              onClick={removeExistingImage}
              className="absolute top-2 right-2 bg-red-500 dark:bg-red-600 text-white p-2 rounded-full hover:bg-red-600 dark:hover:bg-red-700 transition"
            >
              <X size={20} />
            </button>
          </div>
        )}

        {/* Show new image preview */}
        {formData.imagePreview && (
          <div className="relative rounded-lg overflow-hidden border border-gray-300 dark:border-0">
            <Image
              src={formData.imagePreview}
              alt="Project preview"
              width={800}
              height={400}
              className="w-full h-64 object-cover"
            />
            <button
              type="button"
              onClick={removeImage}
              className="absolute top-2 right-2 bg-red-500 dark:bg-red-600 text-white p-2 rounded-full hover:bg-red-600 dark:hover:bg-red-700 transition"
            >
              <X size={20} />
            </button>
          </div>
        )}

        {/* Upload area - only show if no image exists */}
        {!formData.imagePreview && !formData.existingImage && (
          <div className="border-2 border-dashed border-gray-300 dark:border-background/30 rounded-lg p-8 text-center hover:border-primary dark:hover:border-primary-dark transition cursor-pointer">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              id="image-upload"
            />
            <label htmlFor="image-upload" className="cursor-pointer">
              <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400 dark:text-paragraph" />
              <p className="text-sm text-gray-600 dark:text-paragraph mb-1">
                Click to upload project image
              </p>
              <p className="text-xs text-gray-500 dark:text-paragraph">
                PNG, JPG, GIF up to 10MB
              </p>
            </label>
          </div>
        )}

        {/* Change image button when image exists */}
        {(formData.existingImage || formData.imagePreview) && (
          <div className="mt-2">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              id="change-image-upload"
            />
            <label
              htmlFor="change-image-upload"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-background/20 dark:text-background text-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-background/30 transition cursor-pointer text-sm"
            >
              <Upload size={16} />
              Change Image
            </label>
          </div>
        )}
      </div>

      {/* Title */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-heading dark:text-background">
          Project Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => updateFormData({ title: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 dark:border-0 dark:bg-background/10 dark:text-background dark:placeholder-background/30 rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark focus:border-transparent outline-none"
          placeholder="Enter project title"
        />
      </div>

      {/* Short Description */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-heading dark:text-background">
          Short Description <span className="text-red-500">*</span>
        </label>
        <textarea
          value={formData.shortDesc}
          onChange={(e) => updateFormData({ shortDesc: e.target.value })}
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 dark:border-0 dark:bg-background/10 dark:text-background dark:placeholder-background/30 rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark focus:border-transparent outline-none resize-none"
          placeholder="Brief summary of your project"
        />
      </div>

      {/* Full Description */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-heading dark:text-background">
          Full Description <span className="text-red-500">*</span>
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => updateFormData({ description: e.target.value })}
          rows={5}
          className="w-full px-3 py-2 border border-gray-300 dark:border-0 dark:bg-background/10 dark:text-background dark:placeholder-background/30 rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark focus:border-transparent outline-none resize-none"
          placeholder="Detailed description of your project"
        />
      </div>

      {/* Category and Status */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-heading dark:text-background">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.category}
            onChange={(e) => updateFormData({ category: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-0 dark:bg-background/10 dark:text-background rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark focus:border-transparent outline-none bg-white"
          >
            <option value="">Select category</option>
            {PROJECT_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-heading dark:text-background">
            Status <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.status}
            onChange={(e) => updateFormData({ status: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-0 dark:bg-background/10 dark:text-background rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark focus:border-transparent outline-none bg-white"
          >
            <option value="active">Active</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>
    </div>
  );
}
