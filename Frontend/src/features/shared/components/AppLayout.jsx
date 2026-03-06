import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router";
import { useAuth } from "../../auth/hooks/useAuth";
import CreatePostModal from "../../post/components/CreatePostModal";
import "../style/layout.scss";

const SidebarIcon = ({ children }) => (
  <span className="sidebar-icon" aria-hidden="true">{children}</span>
);

export default function AppLayout() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const openCreateModal = () => setCreateModalOpen(true);
  const closeCreateModal = () => setCreateModalOpen(false);

  return (
    <div className="app-layout">
      <aside className="app-sidebar">
        <div className="sidebar-brand" onClick={() => navigate("/")}>
          Instagrow
        </div>
        <nav className="sidebar-nav">
          <NavLink to="/" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")} end>
            <SidebarIcon><svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg></SidebarIcon>
            <span>Home</span>
          </NavLink>
          <div className="nav-item">
            <SidebarIcon><svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg></SidebarIcon>
            <span>Search</span>
          </div>
          <div className="nav-item">
            <SidebarIcon><svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg></SidebarIcon>
            <span>Explore</span>
          </div>
          <div className="nav-item">
            <SidebarIcon><svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M8 5v14l11-7z"/></svg></SidebarIcon>
            <span>Reels</span>
          </div>
          <div className="nav-item">
            <SidebarIcon><svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg></SidebarIcon>
            <span>Messages</span>
          </div>
          <div className="nav-item">
            <SidebarIcon><svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg></SidebarIcon>
            <span>Notifications</span>
          </div>
          <button type="button" className="nav-item nav-item-button" onClick={openCreateModal}>
            <SidebarIcon><svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg></SidebarIcon>
            <span>Create</span>
          </button>
          <NavLink to="/profile" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
            <SidebarIcon><svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg></SidebarIcon>
            <span>Profile</span>
          </NavLink>
        </nav>
        <div className="sidebar-footer">
          <button type="button" className="nav-item nav-item-logout" onClick={() => navigate("/logout")}>
            <SidebarIcon><svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/></svg></SidebarIcon>
            <span>Logout</span>
          </button>
        </div>
      </aside>
      <main className="app-main">
        <Outlet context={{ createModalOpen, openCreateModal, closeCreateModal, user }} />
      </main>
      <CreatePostModal open={createModalOpen} onClose={closeCreateModal} />
    </div>
  );
}
