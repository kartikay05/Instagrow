import { useContext } from "react";
import { AuthContext } from "../auth.context";
import { login, register, getMe, logout } from '../services/auth.api'

export const useAuth = () => {

    const context = useContext(AuthContext)

    const { user, setUser, loading, setLoading, authenticate, setAuthenticate } = context

    const handleLogin = async (username, password) => {
        setLoading(true);
        try {
            const data = await login(username, password);
            setUser(data?.user ?? null);
            setAuthenticate(true);
            return data;
        } finally {
            setLoading(false);
        }
    }

    const handleRegister = async (username, email, password) => {
        setLoading(true);
        try {
            const data = await register(username, email, password);
            setUser(data?.user ?? null);
            setAuthenticate(true);
            return data;
        } finally {
            setLoading(false);
        }
    }

    const handleGetAuth = async () => {
        setLoading(true);
        try {
            const data = await getMe();
            const authed = Boolean(data?.authenticated);
            setAuthenticate(authed);
            setUser(authed ? (data.user ?? null) : null);
            return data;
        } catch {
            setAuthenticate(false);
            setUser(null);
            return { authenticated: false };
        } finally {
            setLoading(false);
        }
    }

    const handleLogout = async () => {
        setLoading(true);
        try {
            await logout();
        } finally {
            setUser(null);
            setAuthenticate(false);
            setLoading(false);
        }
    }

    return {
        user, loading, authenticate, handleLogin, handleRegister, handleGetAuth, handleLogout
    }
}