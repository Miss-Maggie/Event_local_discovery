import axiosClient from "./axiosClient";
import { User } from "@/types/event";

export const authApi = {
    // Login with username/password
    login: async (data: any) => {
        const response = await axiosClient.post("/auth/jwt/create/", data);
        if (response.data.access) {
            localStorage.setItem("access_token", response.data.access);
            localStorage.setItem("refresh_token", response.data.refresh);
            axiosClient.defaults.headers.common["Authorization"] = `Bearer ${response.data.access}`;
        }
        return response.data;
    },

    // Register new user
    signup: async (data: any) => {
        const response = await axiosClient.post("/auth/users/", data);
        return response.data;
    },

    // Get current user details
    getCurrentUser: async (): Promise<User> => {
        const response = await axiosClient.get("/auth/users/me/");
        return response.data;
    },

    // Logout
    logout: () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        delete axiosClient.defaults.headers.common["Authorization"];
    }
};
