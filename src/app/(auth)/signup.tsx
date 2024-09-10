import React, { useState } from "react";
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
  HStack,
  Select,
  CheckIcon,
} from "native-base";
import { useForm, Controller } from "react-hook-form";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { usePushNotifications } from "@/hooks/usePushNotifications";

type RegisterFormInputs = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  userProfile: string;
};

const RegisterScreen = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(""); // Estado para o perfil de usuário
  const router = useRouter();
  const { register, authError, isAuthenticated } = useAuth();
  const { user, updateExpoPushToken } = useAuth();
  const { expoPushToken } = usePushNotifications();

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterFormInputs>();

  const handleRegister = async (data: RegisterFormInputs) => {
    if (!selectedProfile) {
      // Validação para garantir que o perfil foi selecionado
      alert("Please select a user profile");
      return;
    }

    const success = await register(
      data.username,
      data.email,
      data.password,
      selectedProfile // Inclui o perfil de usuário na requisição
    );

    if (success) {
      if (expoPushToken) {
        const notificationToken = expoPushToken.data;
        updateExpoPushToken(notificationToken);
      }
      router.replace("/(tabs)/home");
    }
  };

  return (
    <Center flex={1} bg="white">
      <VStack space={8} w="90%" alignItems="center">
        <HStack w="100%" justifyContent="flex-start">
          <IconButton
            icon={
              <Icon
                as={<Ionicons name="arrow-back" />}
                size={6}
                color="black"
              />
            }
            onPress={() => router.push("/(tabs)/home")}
          />
        </HStack>

        <Text fontSize="3xl" fontWeight="bold" color="gray.800">
          Register
        </Text>

        {/* Campo de Username */}
        <FormControl isInvalid={!!errors.username}>
          <FormControl.Label>Username</FormControl.Label>
          <Controller
            control={control}
            name="username"
            rules={{
              required: "Username is required",
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                placeholder="Enter your username"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                autoCapitalize="none"
              />
            )}
          />
          <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
            {errors.username?.message}
          </FormControl.ErrorMessage>
        </FormControl>

        {/* Campo de Email */}
        <FormControl isInvalid={!!errors.email}>
          <FormControl.Label>Email</FormControl.Label>
          <Controller
            control={control}
            name="email"
            rules={{
              required: "Email is required",
              pattern: {
                value: /^\S+@\S+$/i,
                message: "Invalid email address",
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                placeholder="Enter your email"
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

        {/* Campo de Senha */}
        <FormControl isInvalid={!!errors.password}>
          <FormControl.Label>Password</FormControl.Label>
          <Controller
            control={control}
            name="password"
            rules={{ required: "Password is required", minLength: 8 }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                placeholder="Enter your password"
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

        {/* Campo de Confirmação de Senha */}
        <FormControl isInvalid={!!errors.confirmPassword}>
          <FormControl.Label>Confirm Password</FormControl.Label>
          <Controller
            control={control}
            name="confirmPassword"
            rules={{
              required: "Please confirm your password",
              validate: (value) =>
                value === watch("password") || "Passwords do not match",
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                placeholder="Confirm your password"
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
            {errors.confirmPassword?.message}
          </FormControl.ErrorMessage>
        </FormControl>

        {/* Dropdown de Perfis de Usuário */}
        <FormControl isInvalid={!selectedProfile}>
          <FormControl.Label>Select User Profile</FormControl.Label>
          <Select
            selectedValue={selectedProfile}
            minWidth="200"
            accessibilityLabel="Choose Profile"
            placeholder="Choose Profile"
            _selectedItem={{
              bg: "teal.600",
              endIcon: <CheckIcon size="5" />,
            }}
            mt={1}
            onValueChange={(value) => setSelectedProfile(value)}
          >
            <Select.Item label="Estudante" value="student" />
            <Select.Item label="Professor" value="teacher" />
            <Select.Item
              label="Responsável legal por estudante"
              value="Responsável legal por estudante"
            />
          </Select>
          <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
            Profile is required
          </FormControl.ErrorMessage>
        </FormControl>

        {/* Botão de Registro */}
        <Button
          mt={4}
          w="1/2"
          colorScheme={"green"}
          onPress={handleSubmit(handleRegister)}
        >
          Register
        </Button>
      </VStack>
    </Center>
  );
};

export default RegisterScreen;
