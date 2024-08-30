import React, {
  useState,
  createContext,
  useContext,
  PropsWithChildren,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const backendBaseUrl = "https://devblog-zkbf.onrender.com";

type User = {
  id: string; // Consider adding an 'id' for the user.
  username: string;
  email: string;
  profile: string; // Profile could be optional.
  createdAt: string;
  updatedAt: string;
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
    password: string
  ) => Promise<boolean>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  getToken: () => Promise<string | null>;
  clearToken: () => Promise<void>;
  saveToken: (token: string | null) => Promise<void>;
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
  getToken: async () => null,
  clearToken: async () => {},
  saveToken: async () => {},
});

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState("");

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
    password: string
  ): Promise<boolean> => {
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
          }),
        }
      );
      const responseData = await response.json();
      if (responseData.jwt) {
        setUser(responseData.user);
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
      const response = await fetch(`${backendBaseUrl}/api/auth/local`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identifier: email,
          password: password,
        }),
      });
      const responseData = await response.json();
      if (responseData.jwt) {
        setUser(responseData.user);
        saveToken(responseData.jwt);
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
        register,
        login,
        logout,
        getToken,
        clearToken,
        saveToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
