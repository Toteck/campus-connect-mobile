import "@/styles/global.css";

import { Redirect, Slot, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { NativeBaseProvider } from "native-base";
import {
  useFonts,
  Roboto_400Regular,
  Roboto_500Medium,
  Roboto_700Bold,
} from "@expo-google-fonts/roboto";

import * as SplashScreen from "expo-splash-screen";

import Loading from "@/components/loading";
import React, { useEffect } from "react";
import { useAuth, AuthProvider } from "@/context/AuthContext";
import { PostCacheProvider } from "@/context/PostCacheContext";
import { usePushNotifications } from "@/hooks/usePushNotifications";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export default function Layout() {
  const [loaded, error] = useFonts({
    Roboto_400Regular,
    Roboto_500Medium,
    Roboto_700Bold,
  });

  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return <Loading />;
  }

  return (
    <AuthProvider>
      <PostCacheProvider>
        <NativeBaseProvider>
          <StatusBar style="dark" />
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          </Stack>
        </NativeBaseProvider>
      </PostCacheProvider>
    </AuthProvider>
  );
}
