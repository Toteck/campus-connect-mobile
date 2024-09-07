import { useAuth } from "@/context/AuthContext";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { Redirect, Stack } from "expo-router";

export default function HomeStack() {
  const { user, getToken } = useAuth();
  const { expoPushToken, notification } = usePushNotifications();

  const token = getToken();

  if (!token) {
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
