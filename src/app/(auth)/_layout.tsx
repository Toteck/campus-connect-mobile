import { Redirect, Stack } from "expo-router";

export default function AuthLayout() {
  const session = undefined;

  if (session) {
    return <Redirect href={"/"} />;
  }

  return <Stack />;
}
