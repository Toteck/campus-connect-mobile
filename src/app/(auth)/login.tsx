import React from "react";
import { Center, Button, Text, Icon, VStack } from "native-base";
import { AntDesign } from "@expo/vector-icons";
import { colors } from "@/styles/colors";
import { useRouter } from "expo-router";

const LoginScreen = () => {
  const router = useRouter();
  const goToHome = () => {
    router.replace("/(tabs)/home");
  };
  return (
    <Center flex={1} bg="white">
      <VStack space={8} alignItems="center">
        <Text fontSize="3xl" fontWeight="bold" color="gray.800">
          Campus Connect
        </Text>
        <Button
          startIcon={
            <Icon as={AntDesign} name="google" size="sm" color="white" />
          }
          bg={colors.green["400"]}
          _text={{
            color: "white",
            fontWeight: "bold",
          }}
          shadow={2}
          size="lg"
          onPress={goToHome}
        >
          Entrar com o Google
        </Button>
      </VStack>
    </Center>
  );
};

export default LoginScreen;
