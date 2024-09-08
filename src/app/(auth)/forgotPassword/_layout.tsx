import { Stack, Slot } from "expo-router";

export default function ForgotPasswordStack() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Recuperar senha" }} />
    </Stack>
  );
}
