import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";

const Logout = () => {
  const navigate = useNavigate();
  const { handleLogout } = useAuth();

  useEffect(() => {
    let ignore = false;

    async function run() {
      await handleLogout();
      if (!ignore) navigate("/login", { replace: true });
    }

    run();

    return () => {
      ignore = true;
    };
  }, [handleLogout, navigate]);

  return (
    <main>
      <p>Logging out...</p>
    </main>
  );
};

export default Logout;

