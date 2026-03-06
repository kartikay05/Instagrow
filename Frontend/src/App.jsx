import "./features/shared/global.scss";

import { RouterProvider } from "react-router";
import { router } from "./app.routes";
import { AuthProvider } from "./features/auth/auth.context";
import { PostProvider } from "./features/post/post.context";


function App() {
 
  return (
    <AuthProvider>
      <PostProvider>
        <RouterProvider router={router} />
      </PostProvider>
    </AuthProvider>
  );
}

export default App;
