import React, { useEffect, useState } from "react";
import {
  Center,
  Button,
  Text,
  VStack,
  Input,
  FormControl,
  WarningOutlineIcon,
  IconButton,
  Icon,
} from "native-base";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { colors } from "@/styles/colors"; // Certifique-se que esse caminho está correto
import { Ionicons } from "@expo/vector-icons";
import { usePushNotifications } from "@/hooks/usePushNotifications";

type LoginFormInputs = {
  email: string;
  password: string;
};

const LoginScreen = () => {
  const { login, authError, isAuthenticated, token } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { getUser, getToken, updateExpoPushToken } = useAuth();
  const { expoPushToken } = usePushNotifications();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/(tabs)/home");
    }
  }, [isAuthenticated]);

  const onSubmit = async (data: LoginFormInputs) => {
    const success = await login(data.email, data.password);

    if (success) {
      if (expoPushToken) {
        const notificationToken = expoPushToken.data;
        const user = await getUser();
        const token = await getToken();

        updateExpoPushToken(user, token, notificationToken);
      }
      router.replace("/(tabs)/home");
    }
  };

  return (
    <Center flex={1} bg="white">
      <VStack space={8} w="90%" alignItems="center">
        <Text fontSize="3xl" fontWeight="bold" color="gray.800">
          Campus Connect
        </Text>

        <FormControl isInvalid={!!errors.email}>
          <FormControl.Label>Email</FormControl.Label>
          <Controller
            control={control}
            name="email"
            rules={{
              required: "Email é obrigatório",
              pattern: {
                value: /^\S+@\S+$/i,
                message: "Invalid email address",
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                placeholder="Digite seu email"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            )}
          />
          <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
            {errors.email?.message}
          </FormControl.ErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.password}>
          <FormControl.Label>Senha</FormControl.Label>
          <Controller
            control={control}
            name="password"
            rules={{ required: "Senha é obrigatório", minLength: 8 }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                placeholder="Digite sua senha"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                type={showPassword ? "text" : "password"}
                autoCapitalize="none"
                InputRightElement={
                  <IconButton
                    icon={
                      <Icon
                        as={
                          <Ionicons name={showPassword ? "eye-off" : "eye"} />
                        }
                        size={5}
                        color="muted.400"
                      />
                    }
                    onPress={() => setShowPassword(!showPassword)}
                  />
                }
              />
            )}
          />
          <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
            {errors.password?.message}
          </FormControl.ErrorMessage>
        </FormControl>

        {authError ? (
          <Text color="red.500" fontSize="sm">
            {authError}
          </Text>
        ) : null}

        <Button
          mt={4}
          w="1/2"
          colorScheme={"green"}
          onPress={handleSubmit(onSubmit)}
        >
          Entrar
        </Button>
        <Text
          onPress={() => {
            router.push("/(auth)/forgotPassword");
          }}
        >
          Esqueci minha senha
        </Text>
        <Text fontSize="xl" fontWeight="medium" color="gray.800">
          Ainda não tem conta?
        </Text>
        <Button
          mt={4}
          w="1/2"
          colorScheme={"green"}
          onPress={() => {
            router.replace("/(auth)/signup");
          }}
        >
          Criar minha conta
        </Button>
      </VStack>
    </Center>
  );
};

export default LoginScreen;
