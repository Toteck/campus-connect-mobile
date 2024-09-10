import React, {
  useState,
  createContext,
  useContext,
  PropsWithChildren,
  useEffect,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import axios from "axios";

const backendBaseUrl = "https://devblog-zkbf.onrender.com";

type Modality = {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  slug: string;
};

type Course = {
  id: number;
  description: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  name: string;
};

type Classroom = {
  id: number;
  slug: string;
  createdAt: string;
  updatedAt: string;
  name: string;
};

export type User = {
  id: number; // Alterado para number
  username: string;
  email: string;
  profile: string;
  createdAt: string;
  updatedAt: string;
  blocked: boolean;
  confirmed: boolean;
  provider: string;
  modality?: Modality;
  course?: Course;
  classroom?: Classroom;
  expoPushToken?: string;
};

type AuthState = {
  user: User | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  authError: string;
  register: (
    username: string,
    email: string,
    password: string,
    profile: string
  ) => Promise<boolean>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  getToken: () => Promise<string | null>;
  getUser: () => Promise<User | null>;
  clearToken: () => Promise<void>;
  saveToken: (token: string | null) => Promise<void>;
  updateExpoPushToken: (expoPushToken: string) => Promise<void>;
};

const AuthContext = createContext<AuthState>({
  user: null,
  token: null,
  loading: true,
  isAuthenticated: false,
  authError: "",
  register: async () => false,
  login: async () => false,
  logout: () => {},
  getUser: async () => null,
  getToken: async () => null,
  clearToken: async () => {},
  saveToken: async () => {},
  updateExpoPushToken: async () => {},
});

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    const loadStorageData = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        const storedToken = await AsyncStorage.getItem("authToken");

        if (storedUser && storedToken) {
          setUser(JSON.parse(storedUser));
          setToken(storedToken);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Error loading storage data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadStorageData();
  }, []);

  const saveUser = async (user: User | null) => {
    try {
      if (user) {
        await AsyncStorage.setItem("user", JSON.stringify(user));
      } else {
        await AsyncStorage.removeItem("user");
      }
      setUser(user);
    } catch (error) {
      console.error("Error saving user:", error);
    }
  };

  const saveToken = async (token: string | null) => {
    try {
      if (token) {
        await AsyncStorage.setItem("authToken", token);
      } else {
        await AsyncStorage.removeItem("authToken");
      }
      setToken(token);
    } catch (error) {
      console.error("Error saving token:", error);
    }
  };

  const getUser = async () => {
    try {
      const authToken = await getToken();

      if (!authToken) {
        throw new Error("No token found");
      }

      const response = await axios.get(
        backendBaseUrl + "/api/users/me?populate=*",
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      // Aqui você pode tratar a resposta e atualizar o estado do usuário
      const userData = response.data;

      await saveUser(userData);
      setUser(userData); // Se você quiser armazenar o usuário no estado

      return user;
    } catch (error) {
      console.error("Error getting user:", error);
      return null;
    }
  };

  const getToken = async () => {
    try {
      const storedToken = await AsyncStorage.getItem("authToken");
      setToken(storedToken);
      return storedToken;
    } catch (error) {
      console.error("Error getting token:", error);
      return null;
    }
  };

  const clearToken = async () => {
    try {
      await AsyncStorage.removeItem("authToken");
      setToken(null);
    } catch (error) {
      console.error("Error clearing token:", error);
    }
  };

  const register = async (
    username: string,
    email: string,
    password: string,
    profile: string
  ): Promise<boolean> => {
    console.log(username);
    console.log(email);
    console.log(password);
    console.log(profile);
    try {
      const response = await fetch(
        `https://devblog-zkbf.onrender.com/api/auth/local/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            email,
            password,
            profile,
          }),
        }
      );
      const responseData = await response.json();
      if (responseData.jwt) {
        await saveUser(responseData.user);
        await saveToken(responseData.jwt);
        setIsAuthenticated(true);
        return true;
      } else {
        setAuthError("Invalid details");
        return false;
      }
    } catch (error) {
      setAuthError("Error creating user");
      return false;
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await axios.post(`${backendBaseUrl}/api/auth/local`, {
        identifier: email,
        password: password,
      });
      const responseData = response.data;

      if (responseData?.user && responseData?.jwt) {
        await saveToken(responseData.jwt);
        const responseWithAcademicInfo = await axios.get(
          backendBaseUrl + "/api/users/me?populate=*",
          {
            headers: {
              Authorization: `Bearer ${responseData.jwt}`,
            },
          }
        );

        const user = responseWithAcademicInfo.data;

        await saveUser(user);
        setIsAuthenticated(true);
        return true;
      } else {
        setAuthError("Incorrect email or password");
        return false;
      }
    } catch (error) {
      setAuthError("Error occurred during login");
      return false;
    }
  };

  const updateExpoPushToken = async (expoPushToken: string) => {
    try {
      if (!user || !token) {
        throw new Error("User not authenticated");
      }

      const response = await axios.put(
        `${backendBaseUrl}/api/users/${user.id}`,
        { expoPushToken },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedUser = { ...user, expoPushToken };
      await saveUser(updatedUser);
    } catch (error) {
      console.error("Error updating Expo push token:", error);
    }
  };

  const logout = () => {
    saveToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated,
        authError,
        getUser,
        register,
        login,
        logout,
        getToken,
        clearToken,
        saveToken,
        updateExpoPushToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
