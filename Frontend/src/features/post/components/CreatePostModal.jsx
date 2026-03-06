import { useMemo, useState } from "react";
import { useAuth } from "../../auth/hooks/useAuth";
import { createPost } from "../services/post.api";
import { usePosts } from "../hooks/usePosts";
import "../style/create-post.scss";

const CreatePostModal = ({ open, onClose }) => {
  const { user } = useAuth();
  const { fetchFeed } = usePosts();

  const [caption, setCaption] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const previewUrl = useMemo(() => {
    if (!imageFile) return "";
    return URL.createObjectURL(imageFile);
  }, [imageFile]);

  if (!open) return null;

  const canShare = Boolean(imageFile) && !submitting;

  const submit = async () => {
    if (!imageFile) return;
    setSubmitting(true);
    setError("");
    try {
      await createPost({ caption, imageFile });
      await fetchFeed();
      onClose();
      setCaption("");
      setImageFile(null);
    } catch (e) {
      setError(e?.message || "Failed to create post");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="create-post-modal" role="dialog" aria-modal="true">
      <div className="create-post-backdrop" onClick={onClose} />
      <div className="create-post-card">
        <header className="create-post-header">
          <button type="button" className="create-post-close" onClick={onClose}>
            ✕
          </button>
          <h2>Create New Post</h2>
          <button
            type="button"
            className="create-post-share"
            onClick={submit}
            disabled={!canShare}
          >
            {submitting ? "Sharing..." : "Share"}
          </button>
        </header>

        <div className="create-post-body">
          <section className="create-post-left">
            {!imageFile ? (
              <label className="create-post-picker">
                <div className="picker-icon">🖼</div>
                <p>Select photo from computer</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                  hidden
                />
              </label>
            ) : (
              <div className="create-post-preview">
                <img src={previewUrl} alt="Preview" />
                <button
                  type="button"
                  className="change-photo"
                  onClick={() => setImageFile(null)}
                  disabled={submitting}
                >
                  Change photo
                </button>
              </div>
            )}
          </section>

          <section className="create-post-right">
            <div className="create-post-user">
              <img src={user?.profileImage} alt={user?.username} />
              <p>{user?.username}</p>
            </div>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Write a caption..."
              rows={10}
              disabled={submitting}
            />
            {error && <p className="create-post-error">{error}</p>}
          </section>
        </div>
      </div>
    </div>
  );
};

export default CreatePostModal;

