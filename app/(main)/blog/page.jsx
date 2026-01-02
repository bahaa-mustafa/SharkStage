"use client";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import api from "@/lib/axios";
import {
  MessageSquare,
  Clock,
  Plus,
  Loader2,
  Heart,
  Image as ImageIcon,
  X,
} from "lucide-react";
import AddComment from "./AddComment";
import toast from "react-hot-toast";
import InputField from "@/app/components/InputField";
import Link from "next/link";

export default function BlogPage() {
  const router = useRouter();
  const { isLoggedIn, currentUser } = useSelector((state) => state.auth);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [postLoading, setPostLoading] = useState(false);
  const [likingPosts, setLikingPosts] = useState({});
  const [open, setOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    reset();
    setImagePreview(null);
    setImageFile(null);
  };

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
    fetchPosts();
  }, []);

  useEffect(() => {
    if (window.location.hash) {
      const el = document.getElementById(window.location.hash.slice(1));
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await api.get("/blog");
      setPosts(res.data.allPosts || []);
    } catch (err) {
      console.error("Error fetching posts:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }
      if (!file.type.startsWith("image/")) {
        toast.error("Only image files are allowed");
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const onSubmitLogic = async (data) => {
    setPostLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("content", data.content);
      if (imageFile) {
        formData.append("image", imageFile);
      }

      const res = await api.post("/blog/post/add", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setPosts([res.data.newPost, ...posts]);
      reset();
      handleClose();
      toast.success("Post added successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add post");
    } finally {
      setPostLoading(false);
    }
  };

  const handleLikeToggle = async (e, postId, isLiked) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isLoggedIn) {
      toast.error("Please login to like posts");
      return;
    }

    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post._id === postId
          ? {
              ...post,
              isLiked: !isLiked,
              likesCount: isLiked ? post.likesCount - 1 : post.likesCount + 1,
            }
          : post
      )
    );

    setLikingPosts((prev) => ({ ...prev, [postId]: true }));

    try {
      if (isLiked) {
        await api.delete(`/blog/like/post/${postId}`);
      } else {
        await api.post(`/blog/like/post/${postId}`);
      }
    } catch (err) {
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId
            ? {
                ...post,
                isLiked: isLiked,
                likesCount: isLiked ? post.likesCount + 1 : post.likesCount - 1,
              }
            : post
        )
      );
      toast.error(err.response?.data?.message || "Failed to update like");
    } finally {
      setLikingPosts((prev) => ({ ...prev, [postId]: false }));
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } else if (diffInHours < 48) {
      return "Yesterday";
    } else if (diffInHours < 168) {
      return date.toLocaleDateString("en-US", { weekday: "short" });
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background dark:bg-background-dark flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background dark:bg-background-dark">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-32">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-background">
              Blog
            </h1>
            <p className="text-paragraph mt-1">Share your thoughts and ideas</p>
          </div>

          {isLoggedIn && (
            <>
              <button
                onClick={handleClickOpen}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/70 transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span className="hidden sm:inline">New Post</span>
              </button>
              <AddComment
                title={"Add a Post"}
                handleClickOpen={handleClickOpen}
                handleClose={handleClose}
                onSubmitLogic={onSubmitLogic}
                handleSubmit={handleSubmit}
                postLoading={postLoading}
                open={open}
              >
                <Controller
                  name="title"
                  control={control}
                  rules={{
                    required: "Title is required",
                  }}
                  render={({ field }) => (
                    <InputField
                      label="Post Title"
                      error={errors.title?.message}
                      required
                    >
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
                    <InputField
                      label="Content"
                      error={errors.content?.message}
                      required
                    >
                      <textarea
                        {...field}
                        rows={5}
                        className="w-full dark:placeholder-background/30 px-3 py-2 border border-gray-300 dark:border-0 dark:bg-background/10 dark:text-background rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none"
                        placeholder="Content"
                      />
                    </InputField>
                  )}
                />

                {/* Image Upload */}
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
                        onClick={removeImage}
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
                          <span className="font-semibold">Click to upload</span>{" "}
                          or drag and drop
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
            </>
          )}
        </div>

        {/* Posts List */}
        <div className="space-y-4">
          {posts.length === 0 ? (
            <div className="bg-white dark:bg-background-dark rounded-2xl p-12 text-center">
              <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                No posts yet
              </h2>
              <p className="text-gray-500">
                {isLoggedIn
                  ? "Be the first to share something!"
                  : "Check back later for new posts"}
              </p>
            </div>
          ) : (
            posts.map((post) => (
              <Link
                key={post._id}
                href={`/blog/${post._id}`}
                className="bg-white dark:bg-background/10 rounded-2xl p-6 border border-gray-100 dark:border-0 hover:shadow-lg hover:scale-[1.01] transition-all duration-200 block"
              >
                {/* Author Info */}
                <div className="flex items-center gap-3 mb-4">
                  {post.author?.profilePicUrl ? (
                    <img
                      src={post.author.profilePicUrl}
                      alt={`${post.author.firstName} ${post.author.lastName}`}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary dark:to-heading flex items-center justify-center text-white font-semibold">
                      {post.author?.firstName?.charAt(0)}
                      {post.author?.lastName?.charAt(0)}
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 dark:text-background">
                      {post.author?.firstName} {post.author?.lastName}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-paragraph">
                      <Clock className="w-3 h-3" />
                      <span>{formatTime(post.createdAt)}</span>
                    </div>
                  </div>
                </div>

                {/* Post Content */}
                <h2 className="text-xl font-bold text-gray-900 dark:text-background mb-2">
                  {post.title}
                </h2>

                <p className="text-gray-700 dark:text-paragraph mb-4 line-clamp-3">
                  {post.content}
                </p>

                {/* Post Image */}
                {post.imageUrl && (
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-64 object-cover rounded-lg mb-4"
                  />
                )}
                {/* Engagement */}
                <div className="flex items-center gap-4 pt-4 border-t border-gray-100 dark:border-background/20">
                  {/* Like Button */}
                  <button
                    onClick={(e) => handleLikeToggle(e, post._id, post.isLiked)}
                    disabled={likingPosts[post._id]}
                    className={`flex items-center gap-1 transition-all ${
                      post.isLiked
                        ? "text-red-500"
                        : "text-gray-600 dark:text-paragraph hover:text-red-500"
                    } ${likingPosts[post._id] ? "opacity-50" : ""}`}
                  >
                    <Heart
                      className={`w-5 h-5 ${
                        post.isLiked ? "fill-current" : ""
                      } ${likingPosts[post._id] ? "animate-pulse" : ""}`}
                    />
                    <span className="text-sm font-medium">
                      {post.likesCount || 0}
                    </span>
                  </button>

                  {/* Comments */}
                  <div className="flex items-center gap-1 text-gray-600 dark:text-paragraph">
                    <MessageSquare className="w-4 h-4" />
                    <span className="text-sm">{post.commentsCount || 0}</span>
                    <span className="text-sm">Comments</span>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
