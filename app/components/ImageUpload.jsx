"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/lib/useAuth";

export default function ImageUpload() {
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !user) return;

    setLoading(true);

    const filePath = `${user.uid}/${file.name}`;

    const { data, error } = await supabase.storage
      .from("images")
      .upload(filePath, file);

    if (error) {
      console.error("Upload error:", error);
      alert("Upload failed!");
    } else {
      const {
        data: { publicUrl },
      } = supabase.storage.from("images").getPublicUrl(filePath);
      setImageUrl(publicUrl);
    }

    setLoading(false);
  };

  if (authLoading) return <p>Loading user...</p>;

  return (
    <div className="flex flex-col items-center gap-4">
      <input
        id="fileInput"
        type="file"
        onChange={handleFileChange}
        className="hidden"
      />

      <label
        htmlFor="fileInput"
        className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
      >
        {loading ? "Uploading..." : "Choose Image"}
      </label>
    </div>
  );
}
