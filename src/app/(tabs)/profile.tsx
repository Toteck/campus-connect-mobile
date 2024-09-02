import React, { useState } from "react";
import {
  Box,
  Text,
  Divider,
  Select,
  CheckIcon,
  VStack,
  Image,
  Center,
  Button,
} from "native-base";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";

export default function ProfileScreen() {
  const [selectedProfile, setSelectedProfile] = useState("");
  const [selectedModalidade, setSelectedModalidade] = useState("");
  const [selectedCurso, setSelectedCurso] = useState("");
  const [selectedTurma, setSelectedTurma] = useState("");

  const router = useRouter();

  const { logout, user } = useAuth();

  const goToLogin = () => {
    logout();
    router.replace("/(auth)/login");
  };

  return (
    <Center flex={1} p={4}>
      <VStack space={4} alignItems="center">
        <Image
          size={100}
          borderRadius={100}
          source={{ uri: "https://github.com/toteck.png" }}
          alt="Profile Image"
        />
        <Text fontSize="xl" fontWeight="bold">
          {user?.username}
        </Text>
        <Text fontSize="xl" fontWeight="bold">
          {user?.profile}
        </Text>
        <Divider my={4} />
        <Text textAlign="center" fontSize="md">
          Personalize o conteúdo que você recebe escolha o seu perfil abaixo
        </Text>
        <Select
          selectedValue={selectedProfile}
          minWidth="400"
          accessibilityLabel="Escolha o seu perfil"
          placeholder="Escolha o seu perfil"
          _selectedItem={{
            bg: "teal.600",
            endIcon: <CheckIcon size={5} />,
          }}
          onValueChange={(value) => setSelectedProfile(value)}
        >
          <Select.Item
            label="Responsável legal por estudante"
            value="responsavel"
          />
          <Select.Item label="Estudante" value="estudante" />
          <Select.Item label="Professor" value="professor" />
        </Select>
        {selectedProfile === "estudante" && (
          <>
            <Select
              selectedValue={selectedModalidade}
              minWidth="200"
              accessibilityLabel="Escolha a modalidade do curso"
              placeholder="Escolha a modalidade do curso"
              _selectedItem={{
                bg: "teal.600",
                endIcon: <CheckIcon size={5} />,
              }}
              onValueChange={(value) => setSelectedModalidade(value)}
            >
              <Select.Item label="EJA" value="eja" />
              <Select.Item label="Ensino Médio Técnico" value="medio_tecnico" />
              <Select.Item label="Ensino Superior" value="superior" />
            </Select>
            <Select
              selectedValue={selectedCurso}
              minWidth="200"
              accessibilityLabel="Escolha o curso"
              placeholder="Escolha o curso"
              _selectedItem={{
                bg: "teal.600",
                endIcon: <CheckIcon size={5} />,
              }}
              onValueChange={(value) => setSelectedCurso(value)}
            >
              <Select.Item label="Técnico em Administração" value="adm" />
              <Select.Item
                label="Técnico em Eletroeletrônica"
                value="eletroeletronica"
              />
              <Select.Item
                label="Técnico em Eletromecânica"
                value="eletromecanica"
              />
              <Select.Item label="Técnico em Informática" value="informatica" />
              <Select.Item
                label="Licenciatura em Ciências Biológicas"
                value="biologia"
              />
              <Select.Item
                label="Tecnólogo em Sistemas para Internet"
                value="sistemas_internet"
              />
              <Select.Item
                label="Tecnólogo em Gestão Empresarial"
                value="gestao_empresarial"
              />
            </Select>
            {selectedCurso === "sistemas_internet" && (
              <Select
                selectedValue={selectedTurma}
                minWidth="200"
                accessibilityLabel="Escolha a turma"
                placeholder="Escolha a turma"
                _selectedItem={{
                  bg: "teal.600",
                  endIcon: <CheckIcon size={5} />,
                }}
                onValueChange={(value) => setSelectedTurma(value)}
              >
                <Select.Item label="2022.2" value="2022_2" />
                <Select.Item label="2023.2" value="2023_2" />
              </Select>
            )}
          </>
        )}
      </VStack>
      <Button bgColor={"red.500"} onPress={goToLogin}>
        Sair
      </Button>
    </Center>
  );
}
