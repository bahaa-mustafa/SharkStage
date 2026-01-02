"use client";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter, useParams } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import api from "@/lib/axios";
import {
  ArrowLeft,
  MessageSquare,
  Clock,
  Send,
  Loader2,
  Heart,
  Edit2,
  MoreVertical,
} from "lucide-react";
import DeleteAlert from "@/app/components/DeleteAlert";
import EditPostModal from "@/app/components/blog/EditPostModal";
import EditComment from "@/app/components/blog/EditComment";
import toast from "react-hot-toast";

export default function PostDetailPage() {
  const router = useRouter();
  const params = useParams();
  const postId = params.id;
  const { currentUser, isLoggedIn } = useSelector((state) => state.auth);

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentLoading, setCommentLoading] = useState(false);
  const [postLoading, setPostLoading] = useState(false);
  const [likingPost, setLikingPost] = useState(false);
  const [likingComments, setLikingComments] = useState({});
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [showEditPostModal, setShowEditPostModal] = useState(false);
  const [showPostMenu, setShowPostMenu] = useState(false);
  const [showCommentMenus, setShowCommentMenus] = useState({});

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      content: "",
    },
  });

  useEffect(() => {
    if (postId) {
      fetchPostAndComments();
    }
  }, [postId]);

  const fetchPostAndComments = async () => {
    try {
      setLoading(true);
      const [postRes, commentsRes] = await Promise.all([
        api.get(`/blog/${postId}`),
        api.get(`/blog/post/${postId}`),
      ]);
      setPost(postRes.data.post);
      setComments(commentsRes.data.postComments || []);
    } catch (err) {
      console.error("Error fetching post:", err);
      toast.error("Failed to load post");
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async () => {
    try {
      setPostLoading(true);
      await api.post(`/blog/post/delete/${postId}`);
      toast.success("Post deleted successfully");
      router.push("/blog");
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Failed to delete post");
    } finally {
      setPostLoading(false);
    }
  };

  const handleEditPost = async (formData) => {
    try {
      const res = await api.put(`/blog/post/edit/${postId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setPost(res.data.post);
      setShowEditPostModal(false);
      toast.success("Post updated successfully");
    } catch (error) {
      console.error("Error editing post:", error);
      toast.error("Failed to update post");
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      setCommentLoading(true);
      await api.post(`/blog/comment/delete/${commentId}`);
      toast.success("Comment deleted successfully");
      fetchPostAndComments();
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast.error("Failed to delete comment");
    } finally {
      setCommentLoading(false);
    }
  };

  const handleEditComment = async (commentId, newContent) => {
    try {
      const res = await api.put(`/blog/comment/edit/${commentId}`, {
        content: newContent,
      });
      setComments((prev) =>
        prev.map((c) => (c._id === commentId ? res.data.comment : c))
      );
      setEditingCommentId(null);
      toast.success("Comment updated successfully");
    } catch (error) {
      console.error("Error editing comment:", error);
      toast.error("Failed to update comment");
    }
  };

  const handleLikePost = async () => {
    if (!isLoggedIn) {
      toast.error("Please login to like posts");
      return;
    }

    const isLiked = post.isLiked;
    setPost((prev) => ({
      ...prev,
      isLiked: !isLiked,
      likesCount: isLiked ? prev.likesCount - 1 : prev.likesCount + 1,
    }));

    setLikingPost(true);

    try {
      if (isLiked) {
        await api.delete(`/blog/like/post/${postId}`);
      } else {
        await api.post(`/blog/like/post/${postId}`);
      }
    } catch (err) {
      setPost((prev) => ({
        ...prev,
        isLiked: isLiked,
        likesCount: isLiked ? prev.likesCount + 1 : prev.likesCount - 1,
      }));
      toast.error(err.response?.data?.message || "Failed to update like");
    } finally {
      setLikingPost(false);
    }
  };

  const handleLikeComment = async (commentId, isLiked) => {
    if (!isLoggedIn) {
      toast.error("Please login to like comments");
      return;
    }

    setComments((prev) =>
      prev.map((comment) =>
        comment._id === commentId
          ? {
              ...comment,
              isLiked: !isLiked,
              likesCount: isLiked
                ? comment.likesCount - 1
                : comment.likesCount + 1,
            }
          : comment
      )
    );

    setLikingComments((prev) => ({ ...prev, [commentId]: true }));

    try {
      if (isLiked) {
        await api.delete(`/blog/like/comment/${commentId}`);
      } else {
        await api.post(`/blog/like/comment/${commentId}`);
      }
    } catch (err) {
      setComments((prev) =>
        prev.map((comment) =>
          comment._id === commentId
            ? {
                ...comment,
                isLiked: isLiked,
                likesCount: isLiked
                  ? comment.likesCount + 1
                  : comment.likesCount - 1,
              }
            : comment
        )
      );
      toast.error(err.response?.data?.message || "Failed to update like");
    } finally {
      setLikingComments((prev) => ({ ...prev, [commentId]: false }));
    }
  };

  const onSubmitComment = async (data) => {
    if (!isLoggedIn) {
      toast.error("Please login to comment");
      return;
    }

    try {
      await api.post("/blog/comment/add", {
        content: data.content,
        post: postId,
      });
      reset();
      toast.success("Comment added successfully");
      fetchPostAndComments();
    } catch (err) {
      console.error("Error adding comment:", err);
      toast.error("Failed to add comment");
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } else if (diffInHours < 48) {
      return "Yesterday";
    } else if (diffInHours < 168) {
      return date.toLocaleDateString("en-US", { weekday: "long" });
    } else {
      return date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    }
  };

  const toggleCommentMenu = (commentId) => {
    setShowCommentMenus((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background dark:bg-background-dark flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-background-dark">
        <div className="text-center">
          <p className="text-xl text-gray-600 dark:text-paragraph mb-4">
            Post not found
          </p>
          <button
            onClick={() => router.push("/blog")}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/70"
          >
            Back to Blog
          </button>
        </div>
      </div>
    );
  }

  const isPostAuthor = currentUser?._id === post.author?._id;
  const isAdmin = currentUser?.accountType === "admin";

  return (
    <div className="min-h-screen pt-16 bg-gray-50 dark:bg-background-dark">
      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        <button
          onClick={() => router.push("/blog")}
          className="flex items-center gap-2 text-gray-600 dark:text-paragraph hover:text-gray-900 dark:hover:text-background mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Blog</span>
        </button>

        {/* Post Card */}
        <div className="bg-white dark:bg-background/10 dark:border-0 relative rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm mb-6">
          {(isAdmin || isPostAuthor) && (
            <div className="absolute right-4 top-4">
              <div className="relative">
                <button
                  onClick={() => setShowPostMenu(!showPostMenu)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-background/20 rounded-lg transition-colors"
                >
                  <MoreVertical className="w-5 h-5 text-gray-600 dark:text-paragraph" />
                </button>
                {showPostMenu && (
                  <div className="absolute right-0 mt-2 flex bg-white dark:bg-background/10 rounded-lg shadow-lg border border-gray-200 dark:border-background/20 z-10">
                    {isPostAuthor && (
                      <button
                        onClick={() => {
                          setShowEditPostModal(true);
                          setShowPostMenu(false);
                        }}
                        className="text-blue-700 rounded-lg hover:bg-black/10 p-2 transition-colors"
                      >
                        <Edit2 />
                      </button>
                    )}
                    <DeleteAlert
                      handleDelete={handleDeletePost}
                      title="Delete this post?"
                      deleteLoading={postLoading}
                      triggerButton={
                        <button className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2 rounded-b-lg">
                          Delete
                        </button>
                      }
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 mb-6">
            {post.author?.profilePicUrl ? (
              <img
                src={post.author.profilePicUrl}
                alt={`${post.author.firstName} ${post.author.lastName}`}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary dark:to-heading flex items-center justify-center text-white font-semibold text-lg">
                {post.author?.firstName?.charAt(0)}
                {post.author?.lastName?.charAt(0)}
              </div>
            )}
            <div>
              <p className="font-semibold text-gray-900 dark:text-background text-lg">
                {post.author?.firstName} {post.author?.lastName}
              </p>
              <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-paragraph">
                <Clock className="w-4 h-4" />
                <span>{formatTime(post.createdAt)}</span>
              </div>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 dark:text-background mb-4">
            {post.title}
          </h1>

          {post.imageUrl && (
            <img
              src={post.imageUrl}
              alt={post.title}
              className="w-full h-auto max-h-96 object-cover rounded-lg mb-4"
            />
          )}

          <p className="text-gray-700 dark:text-paragraph text-lg leading-relaxed whitespace-pre-wrap mb-6">
            {post.content}
          </p>

          <div className="flex items-center gap-4 pt-4 border-t border-gray-100 dark:border-background/20">
            <button
              onClick={handleLikePost}
              disabled={likingPost}
              className={`flex items-center gap-2 transition-all ${
                post.isLiked
                  ? "text-red-500"
                  : "text-gray-600 dark:text-paragraph hover:text-red-500"
              } ${likingPost ? "opacity-50" : ""}`}
            >
              <Heart
                className={`w-6 h-6 ${post.isLiked ? "fill-current" : ""} ${
                  likingPost ? "animate-pulse" : ""
                }`}
              />
              <span className="text-base font-medium">
                {post.likesCount || 0}
              </span>
            </button>
            <div className="flex items-center gap-2 text-gray-600 dark:text-paragraph">
              <MessageSquare className="w-5 h-5" />
              <span>{comments.length} Comments</span>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="bg-white dark:bg-background/10 rounded-2xl p-6 border border-gray-100 dark:border-0 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-background mb-6">
            Comments ({comments.length})
          </h2>

          {isLoggedIn ? (
            <div className="mb-8 pb-8 border-b border-gray-100 dark:border-background/20">
              <div className="flex gap-3">
                {currentUser?.profilePicUrl ? (
                  <img
                    src={currentUser.profilePicUrl}
                    alt="Your avatar"
                    className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary dark:to-heading flex items-center justify-center text-white font-semibold flex-shrink-0">
                    {currentUser?.firstName?.charAt(0)}
                    {currentUser?.lastName?.charAt(0)}
                  </div>
                )}
                <div className="flex-1">
                  <Controller
                    name="content"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <textarea
                        {...field}
                        placeholder="Write a comment..."
                        rows={3}
                        className="w-full dark:placeholder-background/30 dark:bg-background/10 dark:text-background dark:border-0 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                      />
                    )}
                  />
                  <div className="flex justify-end mt-2">
                    <button
                      onClick={handleSubmit(onSubmitComment)}
                      className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/70 transition-colors"
                    >
                      <Send className="w-4 h-4" />
                      <span>Comment</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="mb-8 pb-8 border-b border-gray-100 dark:border-background/20 text-center">
              <p className="text-gray-600 dark:text-paragraph mb-3">
                Please login to comment
              </p>
              <button
                onClick={() => router.push("/signin")}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/70 transition-colors"
              >
                Sign In
              </button>
            </div>
          )}

          <div className="space-y-6">
            {comments.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-paragraph" />
                <p className="text-gray-500 dark:text-paragraph">
                  No comments yet. Be the first to comment!
                </p>
              </div>
            ) : (
              comments.map((comment) => {
                const isCommentAuthor =
                  currentUser?._id === comment.author?._id;
                const isEditing = editingCommentId === comment._id;

                return (
                  <div
                    key={comment._id}
                    id={`${comment._id}`}
                    className="flex gap-3"
                  >
                    {comment.author?.profilePicUrl ? (
                      <img
                        src={comment.author.profilePicUrl}
                        alt={`${comment.author.firstName} ${comment.author.lastName}`}
                        className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary dark:to-heading flex items-center justify-center text-white font-semibold flex-shrink-0">
                        {comment.author?.firstName?.charAt(0)}
                        {comment.author?.lastName?.charAt(0)}
                      </div>
                    )}
                    <div className="flex-1">
                      {isEditing ? (
                        <EditComment
                          comment={comment}
                          onSave={handleEditComment}
                          onCancel={() => setEditingCommentId(null)}
                        />
                      ) : (
                        <div className="bg-gray-50 dark:bg-background/10 relative rounded-lg p-4">
                          {(isAdmin || isCommentAuthor) && (
                            <div className="absolute right-2 top-2">
                              <button
                                onClick={() => toggleCommentMenu(comment._id)}
                                className="p-1 hover:bg-gray-200 dark:hover:bg-background/20 rounded transition-colors"
                              >
                                <MoreVertical className="w-4 h-4 text-gray-600 dark:text-paragraph" />
                              </button>
                              {showCommentMenus[comment._id] && (
                                <div className="absolute right-0 mt-1 flex bg-white dark:bg-background/10 rounded-lg shadow-lg border border-gray-200 dark:border-background/20 z-10">
                                  {isCommentAuthor && (
                                    <button
                                      onClick={() => {
                                        setEditingCommentId(comment._id);
                                        toggleCommentMenu(comment._id);
                                      }}
                                      className="text-blue-700 rounded-lg hover:bg-black/10 p-2 transition-colors"
                                    >
                                      <Edit2 />
                                    </button>
                                  )}
                                  <DeleteAlert
                                    handleDelete={() =>
                                      handleDeleteComment(comment._id)
                                    }
                                    title="Delete this comment?"
                                    deleteLoading={commentLoading}
                                    triggerButton={
                                      <button className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-b-lg">
                                        Delete
                                      </button>
                                    }
                                  />
                                </div>
                              )}
                            </div>
                          )}

                          <div className="flex items-baseline justify-between mb-1 pr-8">
                            <p className="font-semibold text-gray-900 dark:text-background">
                              {comment.author?.firstName}{" "}
                              {comment.author?.lastName}
                            </p>
                            <span className="text-xs text-gray-500 dark:text-paragraph">
                              {formatTime(comment.createdAt)}
                              {comment.edited && " (edited)"}
                            </span>
                          </div>
                          <p className="text-gray-700 dark:text-paragraph mb-3">
                            {comment.content}
                          </p>

                          <button
                            onClick={() =>
                              handleLikeComment(comment._id, comment.isLiked)
                            }
                            disabled={likingComments[comment._id]}
                            className={`flex items-center gap-1 text-sm transition-all ${
                              comment.isLiked
                                ? "text-red-500"
                                : "text-gray-600 dark:text-paragraph hover:text-red-500"
                            } ${
                              likingComments[comment._id] ? "opacity-50" : ""
                            }`}
                          >
                            <Heart
                              className={`w-4 h-4 ${
                                comment.isLiked ? "fill-current" : ""
                              } ${
                                likingComments[comment._id]
                                  ? "animate-pulse"
                                  : ""
                              }`}
                            />
                            <span className="font-medium">
                              {comment.likesCount || 0}
                            </span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Edit Post Modal */}
      <EditPostModal
        isOpen={showEditPostModal}
        onClose={() => setShowEditPostModal(false)}
        post={post}
        onUpdate={handleEditPost}
      />
    </div>
  );
}
