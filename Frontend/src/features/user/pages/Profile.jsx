import { useAuth } from "../../auth/hooks/useAuth";

const Profile = () => {
  const { user } = useAuth();

  return (
    <main>
      <h1 style={{ marginBottom: "1rem" }}>{user?.username}</h1>
      <p style={{ color: "#9ca3af" }}>
        Profile page (coming next): posts grid, followers/following, edit profile.
      </p>
    </main>
  );
};

export default Profile;

