import { useAuth } from "@/context/AuthContext";
import { Redirect, Stack } from "expo-router";

export default function HomeStack() {
  const { isAuthenticated, loading } = useAuth();

  if (!isAuthenticated) {
    return <Redirect href={"/(auth)/login"} />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" options={{ title: "Inicio" }} />
    </Stack>
  );
}
