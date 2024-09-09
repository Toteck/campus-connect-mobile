import { Stack, Slot } from "expo-router";

export default function ResetPasswordStack() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Resetar senha" }} />
    </Stack>
  );
}
