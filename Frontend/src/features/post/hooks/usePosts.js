import { useContext } from "react";
import { PostContext } from "../post.context";
import { getFeed } from "../services/post.api";

export const usePosts = () => {
  const context = useContext(PostContext);

  if (!context) {
    throw new Error("usePosts must be used within a PostProvider");
  }

  const { posts, setPosts, loading, setLoading } = context;

  const fetchFeed = async () => {
    setLoading(true);
    try {
      const data = await getFeed();
      setPosts(data?.feed ?? []);
      return data;
    } finally {
      setLoading(false);
    }
  };

  return {
    posts,
    loading,
    fetchFeed,
    setPosts,
    updatePost: (postId, updater) => {
      setPosts((prev) =>
        prev.map((p) => (p?._id === postId ? updater(p) : p))
      );
    },
  };
};

