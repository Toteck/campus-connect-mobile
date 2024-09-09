import React from "react";
import { Alert } from "react-native";
import { useForm, Controller } from "react-hook-form";
import {
  View,
  Button,
  Input,
  FormControl,
  VStack,
  Text,
  Center,
} from "native-base";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useLocalSearchParams } from "expo-router";
import { useRouter } from "expo-router";

const schema = yup.object().shape({
  password: yup
    .string()
    .min(8, "A senha deve ter pelo menos 8 caracteres")
    .required("Senha é obrigatória"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), undefined], "As senhas devem coincidir")
    .required("Confirmação de senha é obrigatória"),
});

const ResetPassword = () => {
  const { code } = useLocalSearchParams();
  //const { code } = route.params; // O token recebido no email é passado via rota
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handlePasswordReset = async (data: any) => {
    const { password, confirmPassword } = data;

    try {
      const response = await fetch(
        "https://devblog-zkbf.onrender.com/api/auth/reset-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            password,
            passwordConfirmation: confirmPassword,
            code,
          }),
        }
      );

      const responseData = await response.json();

      if (response.ok) {
        Alert.alert("Sucesso", "Senha alterada com sucesso");
        router.navigate("/(auth)/login"); // Redireciona o usuário para a tela de login
      } else {
        Alert.alert(
          "Erro",
          responseData.error.message || "Ocorreu um erro ao alterar a senha."
        );
      }
    } catch (error) {
      console.error(error);
      Alert.alert(
        "Erro",
        "Não foi possível alterar a senha. Tente novamente mais tarde."
      );
    }
  };

  return (
    <Center flex={1} px={4}>
      <VStack space={4} width="100%">
        <Text fontSize="lg" fontWeight="bold" textAlign="center">
          Redefinir Senha
        </Text>

        <FormControl isInvalid={"password" in errors}>
          <FormControl.Label>Nova Senha</FormControl.Label>
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                placeholder="Digite a nova senha"
                secureTextEntry
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors.password && (
            <FormControl.ErrorMessage>
              {errors.password.message}
            </FormControl.ErrorMessage>
          )}
        </FormControl>

        <FormControl isInvalid={"confirmPassword" in errors}>
          <FormControl.Label>Confirmar Nova Senha</FormControl.Label>
          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                placeholder="Confirme a nova senha"
                secureTextEntry
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors.confirmPassword && (
            <FormControl.ErrorMessage>
              {errors.confirmPassword.message}
            </FormControl.ErrorMessage>
          )}
        </FormControl>

        <Button onPress={handleSubmit(handlePasswordReset)} mt="2">
          Alterar senha
        </Button>
        <Button onPress={() => {}} mt="2">
          Voltar para login
        </Button>
      </VStack>
    </Center>
  );
};

export default ResetPassword;
