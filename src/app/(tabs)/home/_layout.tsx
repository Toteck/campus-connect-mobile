import { useAuth } from "@/context/AuthContext";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { Redirect, Stack } from "expo-router";

export default function HomeStack() {
  const { expoPushToken, notification } = usePushNotifications();

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
