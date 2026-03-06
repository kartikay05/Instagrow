import { createBrowserRouter } from "react-router";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import NotFound from "./features/others/NotFound";
import Feed from "./features/post/pages/Feed";
import ProtectedRoute from "./features/others/ProtectedRoute";
import PublicRoute from "./features/others/PublicRoute";
import Logout from "./features/auth/pages/Logout";
import AppLayout from "./features/shared/components/AppLayout";
import Profile from "./features/user/pages/Profile";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    ),
  },
  {
    path: "/register",
    element: (
      <PublicRoute>
        <Register />
      </PublicRoute>
    ),
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Feed />,
      },
      {
        path: "logout",
        element: <Logout />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
