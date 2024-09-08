import React, { useState } from "react";
import {
  Center,
  VStack,
  FormControl,
  Input,
  Button,
  Text,
  WarningOutlineIcon,
  Box,
} from "native-base";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "expo-router";
import axios from "axios";

type ForgotPasswordFormInputs = {
  email: string;
};

export default function ForgotPassword() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormInputs>();

  const onSubmit = async (data: ForgotPasswordFormInputs) => {
    try {
      const { email } = data;
      const sucess = await axios.post(
        "https://devblog-zkbf.onrender.com/api/auth/forgot-password",
        { email }
      );
      if (sucess) {
        setIsSubmitted(true);
      } else {
        throw Error("Erro ao enviar email de recuperação de senha");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Center flex={1} bg="white">
      {!isSubmitted ? (
        <VStack space={4} w="90%" alignItems="center">
          <Text fontSize="2xl" fontWeight="bold" color="gray.800">
            Solicitar uma redefinição de senha
          </Text>
          <Text
            fontSize="md"
            fontWeight="semibold"
            color="gray.800"
            textAlign="justify"
          >
            Esqueceu sua senha? Insira o e-mail da sua conta aqui e nós lhe
            enviaremos um link que você pode usar para redefinir sua senha.
          </Text>

          <FormControl isInvalid={!!errors.email}>
            <FormControl.Label>Email</FormControl.Label>
            <Controller
              control={control}
              name="email"
              rules={{
                required: "O email é obrigatório",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Email inválido",
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
            <FormControl.ErrorMessage
              leftIcon={<WarningOutlineIcon size="xs" />}
            >
              {errors.email?.message}
            </FormControl.ErrorMessage>
          </FormControl>

          <Button colorScheme="green" onPress={handleSubmit(onSubmit)}>
            Enviar
          </Button>
        </VStack>
      ) : (
        <>
          <Text fontSize="lg" color="gray.800" textAlign="center" mb={"3"}>
            Nós lhe enviamos um e-mail com um link. Abra este link para
            redefinir sua senha.
          </Text>
          <Button
            onPress={() => {
              router.navigate("(auth)/login");
            }}
          >
            Voltar para o login
          </Button>
        </>
      )}
    </Center>
  );
}
