import React, { useEffect, useState } from "react";
import {
  Box,
  Text,
  Divider,
  Select,
  CheckIcon,
  VStack,
  Center,
  Button,
  Alert,
  HStack,
  IconButton,
  CloseIcon,
} from "native-base";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Modality } from "@/types/modality";
import { Course } from "@/types/course";
import { Classroom } from "@/types/classroom";

export default function ProfileScreen() {
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm();
  const [modalidades, setModalidades] = useState<
    { label: string; value: number }[]
  >([]);
  const [cursos, setCursos] = useState<{ label: string; value: number }[]>([]);
  const [turmas, setTurmas] = useState<{ label: string; value: number }[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertType, setAlertType] = useState<"success" | "error">("success");
  const [alertMessage, setAlertMessage] = useState<string>("");

  const [selectedModalidadeName, setSelectedModalidadeName] =
    useState<string>("");
  const [selectedCursoName, setSelectedCursoName] = useState<string>("");
  const [selectedTurmaName, setSelectedTurmaName] = useState<string>("");

  const selectedModalidade = watch("modalidade");
  const selectedCurso = watch("curso");
  const selectedTurma = watch("turma");

  // Função para controlar a mudança de cor ao clicar no botão de edição
  const [buttonColor, setButtonColor] = useState("green.600");
  const handleEditClick = () => {
    setIsEditing(true);
    setButtonColor("green.800"); // Muda a cor quando o botão for clicado
  };

  const router = useRouter();

  const { logout, user, token, saveUser, getUser } = useAuth();

  useEffect(() => {
    axios
      .get("https://devblog-zkbf.onrender.com/api/course-modalities/")
      .then((response) => {
        const fetchedModalidades = response.data.data.map(
          (modalidade: Modality) => ({
            label: modalidade.attributes.name,
            value: modalidade.id,
          })
        );
        setModalidades(fetchedModalidades);
      })
      .catch((error) => console.error(error));
  }, []);

  useEffect(() => {
    if (selectedModalidade) {
      const selectedModalidadeObj = modalidades.find(
        (modalidade) => modalidade.value === selectedModalidade
      );
      if (selectedModalidadeObj) {
        setSelectedModalidadeName(selectedModalidadeObj.label);
      }

      axios
        .get(
          `https://devblog-zkbf.onrender.com/api/course-modalities/${selectedModalidade}?populate=courses`
        )
        .then((response) => {
          const fetchedCursos = response.data.data.attributes.courses.data.map(
            (course: Course) => ({
              label: course.attributes.name,
              value: course.id,
            })
          );
          setCursos(fetchedCursos);
          setValue("curso", ""); // Reseta o curso selecionado
          setValue("turma", ""); // Reseta a turma selecionada
          setTurmas([]); // Limpa as turmas quando a modalidade muda
        })
        .catch((error) => console.error(error));
    }
  }, [selectedModalidade]);

  useEffect(() => {
    if (selectedCurso) {
      const selectedCursoObj = cursos.find(
        (curso) => curso.value === selectedCurso
      );
      if (selectedCursoObj) {
        setSelectedCursoName(selectedCursoObj.label);
      }

      axios
        .get(
          `https://devblog-zkbf.onrender.com/api/courses/${selectedCurso}?populate=classrooms`
        )
        .then((response) => {
          const fetchedTurmas =
            response.data.data.attributes.classrooms.data.map(
              (turma: Classroom) => ({
                label: turma.attributes.name,
                value: turma.id,
              })
            );
          setTurmas(fetchedTurmas);
          setValue("turma", ""); // Reseta a turma selecionada
        })
        .catch((error) => console.error(error));
    }
  }, [selectedCurso]);

  useEffect(() => {
    if (selectedTurma) {
      const selectedTurmaObj = turmas.find(
        (turma) => turma.value === selectedTurma
      );
      if (selectedTurmaObj) {
        setSelectedTurmaName(selectedTurmaObj.label);
      }
    }
  }, [selectedTurma]);

  const onSubmit = async (data: any) => {
    const updateData = {
      classroom: data.turma,
      course: data.curso,
      modality: data.modalidade,
    };

    axios
      .put(
        `https://devblog-zkbf.onrender.com/api/users/${user?.id}`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(async (response) => {
        console.log("Tela profile após fazer o put do usuário");

        const updatedUser = await getUser();
        if (updatedUser) {
          await saveUser(updatedUser);

          setAlertType("success");
          setAlertMessage("Perfil atualizado com sucesso!");
          setShowAlert(true);
          // Sai do modo edição após salvar
          setIsEditing(false);
        } else {
          throw new Error("User is null");
        }
      })
      .catch((error) => {
        setAlertType("error");
        setAlertMessage("Erro ao atualizar perfil.");
        setShowAlert(true);
      });
    //await saveUser;
  };

  const goToLogin = () => {
    logout();
    router.replace("/(auth)/login");
  };

  const getSelectedText = (label: string, value?: string) => {
    return value ? `${label}: ${value}` : `${label}: Não selecionado`;
  };

  // Verifica se todos os campos estão preenchidos
  const isFormValid = selectedModalidade && selectedCurso && selectedTurma;

  return (
    <Center flex={1} p={4} bgColor="white">
      <VStack
        space={4}
        alignItems="center"
        bgColor="green.100"
        p={6}
        borderRadius="lg"
        shadow={3}
        w="90%"
        maxW="400px"
      >
        <Text
          fontSize="3xl"
          fontWeight="bold"
          textAlign={"center"}
          color="green.700"
        >
          Nome de usuário {"\n"}
          {user?.username}
        </Text>

        <Text
          fontSize="2xl"
          fontWeight="bold"
          textAlign={"center"}
          color="green.700"
        >
          Perfil {"\n"}
          {user?.profile}
        </Text>

        <Divider my={4} bgColor="green.700" />

        {user?.profile === "Estudante" && (
          <>
            {!isEditing && (
              <>
                <Text fontSize="xl" color="green.800">
                  <Text fontWeight={"bold"}>Modalidade:</Text>{" "}
                  {user?.modality?.name || "Não selecionado"}
                </Text>
                <Text fontSize="xl" color="green.800">
                  <Text fontWeight={"bold"}>Curso:</Text>{" "}
                  {user?.course?.name || "Não selecionado"}
                </Text>
                <Text fontSize="xl" color="green.800">
                  <Text fontWeight={"bold"}>Turma:</Text>{" "}
                  {user?.classroom?.name || "Não selecionado"}
                </Text>
                <Button
                  bg={buttonColor}
                  _pressed={{ bg: "green.800" }}
                  onPress={handleEditClick}
                  size="lg"
                  mt={4}
                >
                  Editar Modalidade, Curso e Turma
                </Button>
              </>
            )}

            {isEditing && (
              <Box width={"full"}>
                <Select
                  selectedValue={selectedModalidade}
                  minWidth="200"
                  placeholder="Escolha a modalidade do curso"
                  bgColor={"green.600"}
                  color={"white"}
                  fontWeight={"semibold"}
                  fontSize={"lg"}
                  mb={"4"}
                  _selectedItem={{
                    bg: "green.600",
                    endIcon: <CheckIcon size={5} />,
                  }}
                  onValueChange={(value) => setValue("modalidade", value)}
                >
                  {modalidades.map((modalidade) => (
                    <Select.Item
                      key={modalidade.value}
                      label={modalidade.label}
                      value={modalidade.value.toString()}
                    />
                  ))}
                </Select>

                <Select
                  selectedValue={selectedCurso}
                  minWidth="200"
                  placeholder="Escolha o curso"
                  bgColor={"green.600"}
                  color={"white"}
                  fontWeight={"semibold"}
                  fontSize={"lg"}
                  mb={"4"}
                  _selectedItem={{
                    bg: "green.600",
                    endIcon: <CheckIcon size={5} />,
                  }}
                  isDisabled={!selectedModalidade}
                  onValueChange={(value) => setValue("curso", value)}
                >
                  {cursos.map((curso) => (
                    <Select.Item
                      key={curso.value}
                      label={curso.label}
                      value={curso.value.toString()}
                    />
                  ))}
                </Select>

                <Select
                  selectedValue={selectedTurma}
                  minWidth="200"
                  placeholder="Escolha a turma"
                  bgColor={"green.600"}
                  color={"white"}
                  fontWeight={"semibold"}
                  fontSize={"lg"}
                  mb={"4"}
                  _selectedItem={{
                    bg: "green.600",
                    endIcon: <CheckIcon size={5} />,
                  }}
                  isDisabled={!selectedCurso}
                  onValueChange={(value) => setValue("turma", value)}
                >
                  {turmas.map((turma) => (
                    <Select.Item
                      key={turma.value}
                      label={turma.label}
                      value={turma.value.toString()}
                    />
                  ))}
                </Select>

                <Button
                  isDisabled={!isFormValid}
                  onPress={handleSubmit(onSubmit)}
                  size="lg"
                  bg="green.500"
                  _pressed={{ bg: "green.700" }}
                  mt={4}
                >
                  Salvar
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  borderColor="green.500"
                  _pressed={{ bg: "green.100" }}
                  onPress={() => setIsEditing(false)}
                  mt={2}
                >
                  Cancelar
                </Button>
              </Box>
            )}
          </>
        )}

        <Button onPress={goToLogin} colorScheme="red" size="lg" mt={4}>
          Sair
        </Button>
      </VStack>

      {showAlert && (
        <Alert w="100%" status={alertType} mt={4}>
          <VStack space={2} flexShrink={1} w="100%">
            <HStack
              flexShrink={1}
              space={2}
              alignItems="center"
              justifyContent="space-between"
            >
              <HStack space={2} flexShrink={1} alignItems="center">
                <Alert.Icon />
                <Text fontSize="md" color="coolGray.800">
                  {alertMessage}
                </Text>
              </HStack>
              <IconButton
                onPress={() => setShowAlert(false)}
                variant="unstyled"
                icon={<CloseIcon size="3" color="coolGray.600" />}
              />
            </HStack>
          </VStack>
        </Alert>
      )}
    </Center>
  );
}
