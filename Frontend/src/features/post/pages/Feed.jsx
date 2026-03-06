import { useEffect, useMemo, useState } from "react";
import { usePosts } from "../hooks/usePosts";
import { likePost } from "../services/post.api";
import { followUser, unfollowUser } from "../../user/services/user.api";
import { useAuth } from "../../auth/hooks/useAuth";
import "../style/feed.scss";

function timeAgo(dateString) {
  if (!dateString) return "";
  const diffMs = Date.now() - new Date(dateString).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} minutes ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hours ago`;
  const days = Math.floor(hours / 24);
  return `${days} days ago`;
}

const Feed = () => {
  const { posts, loading, fetchFeed, updatePost } = usePosts();
  const { user } = useAuth();
  const [heartBurstPostId, setHeartBurstPostId] = useState(null);
  const [pendingLike, setPendingLike] = useState(new Set());
  const [pendingFollow, setPendingFollow] = useState(new Set());

  useEffect(() => {
    fetchFeed();
  }, []);

  const storyUsers = useMemo(() => {
    return Array.from(
      new Map(
        posts
          .filter((p) => p?.user?.username)
          .map((p) => [p.user.username, p.user])
      ).values()
    ).slice(0, 12);
  }, [posts]);

  const burstHeart = (postId) => {
    setHeartBurstPostId(postId);
    window.setTimeout(() => {
      setHeartBurstPostId((prev) => (prev === postId ? null : prev));
    }, 900);
  };

  const toggleLike = async (post) => {
    if (!post?._id) return;
    if (pendingLike.has(post._id)) return;

    const wasLiked = Boolean(post.isLiked);
    setPendingLike((prev) => new Set(prev).add(post._id));

    // optimistic UI
    updatePost(post._id, (p) => ({
      ...p,
      isLiked: !wasLiked,
      likeCount: Math.max(0, (p.likeCount ?? 0) + (wasLiked ? -1 : 1)),
    }));

    try {
      await likePost(post._id);
    } catch {
      // revert by refetch
      fetchFeed();
    } finally {
      setPendingLike((prev) => {
        const next = new Set(prev);
        next.delete(post._id);
        return next;
      });
    }
  };

  const toggleFollow = async (post) => {
    const author = post?.user?.username;
    if (!post?._id || !author) return;
    if (author === user?.username) return;
    if (pendingFollow.has(author)) return;

    const wasFollowing = Boolean(post.isFollowing);
    setPendingFollow((prev) => new Set(prev).add(author));

    // optimistic: update all posts by same author
    const updateAuthor = (nextFollowing) => {
      posts
        .filter((p) => p?.user?.username === author)
        .forEach((p) => {
          updatePost(p._id, (x) => ({ ...x, isFollowing: nextFollowing }));
        });
    };

    updateAuthor(!wasFollowing);

    try {
      if (wasFollowing) {
        await unfollowUser(author);
      } else {
        await followUser(author);
      }
    } catch {
      fetchFeed();
    } finally {
      setPendingFollow((prev) => {
        const next = new Set(prev);
        next.delete(author);
        return next;
      });
    }
  };

  return (
    <div className="feed-page">
      <section className="stories-row" aria-label="Stories">
        {storyUsers.map((u) => (
          <div key={u.username} className="story">
            <img className="story-avatar" src={u.profileImage} alt={u.username} />
            <p className="story-name">{u.username}</p>
          </div>
        ))}
      </section>

      {loading && (
        <div className="feed-loading">
          <p>Loading feed...</p>
        </div>
      )}

      {!loading && (
        <section className="feed">
          <div className="post-wrapper">
            {posts.map((post) => (
              <article key={post._id} className="post">
                <header className="post-header">
                  <div className="post-user">
                    <img
                      className="post_avatar"
                      src={post.user?.profileImage}
                      alt={post.user?.username || "User"}
                    />
                    <div className="post-user-meta">
                      <div className="post-user-top">
                        <p className="post-username">{post.user?.username}</p>
                        {post.user?.username &&
                          user?.username &&
                          post.user.username !== user.username && (
                            <button
                              type="button"
                              className="follow-btn"
                              onClick={() => toggleFollow(post)}
                              disabled={pendingFollow.has(post.user.username)}
                            >
                              {post.isFollowing ? "Unfollow" : "Follow"}
                            </button>
                          )}
                      </div>
                      <p className="post-time">{timeAgo(post.createdAt)}</p>
                    </div>
                  </div>

                  <button type="button" className="post-menu" aria-label="Post menu">
                    •••
                  </button>
                </header>

                <div className="post-image-wrap">
                  <img
                    className="post_image"
                    src={post.imgUrl}
                    alt={post.caption || "Post image"}
                    onDoubleClick={() => {
                      burstHeart(post._id);
                      if (!post.isLiked) toggleLike(post);
                    }}
                  />
                  {heartBurstPostId === post._id && (
                    <div className="heart-burst" aria-hidden>
                      ♥
                    </div>
                  )}
                </div>

                <div className="post-actions">
                  <button
                    type="button"
                    className={post.isLiked ? "icon-btn liked" : "icon-btn"}
                    aria-label="Like"
                    onClick={() => toggleLike(post)}
                    disabled={pendingLike.has(post._id)}
                  >
                    {post.isLiked ? "♥" : "♡"}
                  </button>
                  <button type="button" className="icon-btn" aria-label="Comment">
                    💬
                  </button>
                  <button type="button" className="icon-btn" aria-label="Share">
                    ↗
                  </button>
                  <button type="button" className="icon-btn bookmark" aria-label="Save">
                    ⌁
                  </button>
                </div>

                <div className="post-stats">
                  <p className="likes">{post.likeCount ?? 0} likes</p>
                </div>

                <div className="bottom">
                  <div className="caption">
                    <p>
                      <span className="caption-user">{post.user?.username}</span>{" "}
                      {post.caption}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default Feed;
