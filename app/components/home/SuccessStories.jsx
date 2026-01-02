"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MessageSquare, ArrowRight, Loader2 } from "lucide-react";
import api from "@/lib/axios";

export default function SuccessStories() {
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await api.get("/blog");
      setPosts(res.data.allPosts?.slice(0, 2) || []);
    } catch (err) {
      console.error("Error fetching posts:", err);
    } finally {
      setLoading(false);
    }
  };

  const truncateText = (text, maxLength = 150) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + "...";
  };

  if (loading) {
    return (
      <div className="py-16 bg-background dark:bg-background-dark">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex justify-center">
            <Loader2 className="animate-spin text-primary" size={40} />
          </div>
        </div>
      </div>
    );
  }

  if (posts.length === 0) return null;

  return (
    <div className="py-16 bg-background dark:bg-background-dark">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl dark:text-background sm:text-5xl font-bold  mb-4">
            Success Stories
          </h2>
          <p className="text-paragraph mt-2 max-w-2xl mx-auto">
            Read about the latest experiences and achievements from our
            community
          </p>
        </div>

        {/* Posts Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {posts.map((post) => (
            <div
              key={post._id}
              onClick={() => router.push(`/blog/${post._id}`)}
              className="bg-white dark:bg-background/10 rounded-2xl p-6 border border-gray-200 dark:border-0 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer group"
            >
              {/* Author */}
              <div className="flex items-center gap-3 mb-4">
                {post.author?.profilePicUrl ? (
                  <img
                    src={post.author.profilePicUrl}
                    alt={`${post.author.firstName} ${post.author.lastName}`}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-semibold text-lg">
                    {post.author?.firstName?.charAt(0)}
                    {post.author?.lastName?.charAt(0)}
                  </div>
                )}
                <div>
                  <p className="font-semibold text-gray-900">
                    {post.author?.firstName} {post.author?.lastName}
                  </p>
                  <p className="text-sm text-gray-500">Shared their story</p>
                </div>
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold dark:text-background mb-3 group-hover:text-primary transition-colors">
                {truncateText(post.title, 60)}
              </h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                {truncateText(post.content)}
              </p>

              {/* Read More */}
              <div className="flex items-center gap-2 text-primary font-medium group-hover:gap-3 transition-all">
                <span>Read full story</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <button
            onClick={() => router.push("/blog")}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all hover:scale-105 font-medium shadow-lg shadow-primary/20"
          >
            <MessageSquare className="w-5 h-5" />
            <span>View All Stories</span>
          </button>
        </div>
      </div>
    </div>
  );
}
