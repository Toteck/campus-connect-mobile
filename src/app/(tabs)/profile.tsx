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
    <Center flex={1} p={4}>
      <VStack space={4} alignItems="center">
        <Text fontSize="4xl" fontWeight="bold" textAlign={"center"}>
          Nome de usuário {"\n"}
          {user?.username}
        </Text>

        <Text fontSize="xl" fontWeight="bold" textAlign={"center"}>
          Perfil {"\n"}
          {user?.profile}
        </Text>
        <Divider my={4} />
        {user?.profile === "Estudante" && (
          <>
            {!isEditing && (
              <>
                <Text>
                  Modalidade:{" "}
                  {user?.modality ? user?.modality?.name : "Não selecionado"}
                </Text>
                <Text>
                  {" "}
                  Curso: {user?.course ? user?.course?.name : "Não selecionado"}
                </Text>
                <Text>
                  {" "}
                  Turma:{" "}
                  {user?.classroom ? user?.classroom?.name : "Não selecionado"}
                </Text>
                <Button bgColor={"blue.500"} onPress={() => setIsEditing(true)}>
                  Editar Modalidade, Curso e Turma
                </Button>
              </>
            )}

            {isEditing && (
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
                  onValueChange={(value) => setValue("modalidade", value)}
                >
                  {modalidades.map((modalidade) => (
                    <Select.Item
                      key={modalidade.value}
                      label={modalidade.label}
                      value={modalidade.value}
                    />
                  ))}
                </Select>
                {errors.modalidade && (
                  <Text color="red.500">Modalidade é obrigatória.</Text>
                )}

                <Select
                  selectedValue={selectedCurso}
                  minWidth="200"
                  accessibilityLabel="Escolha o curso"
                  placeholder="Escolha o curso"
                  _selectedItem={{
                    bg: "teal.600",
                    endIcon: <CheckIcon size={5} />,
                  }}
                  isDisabled={!selectedModalidade} // Disable until modalidade is selected
                  onValueChange={(value) => setValue("curso", value)}
                >
                  {cursos.map((curso) => (
                    <Select.Item
                      key={curso.value}
                      label={curso.label}
                      value={curso.value}
                    />
                  ))}
                </Select>
                {errors.curso && (
                  <Text color="red.500">Curso é obrigatório.</Text>
                )}

                <Select
                  selectedValue={selectedTurma}
                  minWidth="200"
                  accessibilityLabel="Escolha a turma"
                  placeholder="Escolha a turma"
                  _selectedItem={{
                    bg: "teal.600",
                    endIcon: <CheckIcon size={5} />,
                  }}
                  isDisabled={!selectedCurso} // Disable until curso is selected
                  onValueChange={(value) => setValue("turma", value)}
                >
                  {turmas.map((turma) => (
                    <Select.Item
                      key={turma.value}
                      label={turma.label}
                      value={turma.value}
                    />
                  ))}
                </Select>
                {errors.turma && (
                  <Text color="red.500">Turma é obrigatória.</Text>
                )}

                <Button
                  isDisabled={!isFormValid}
                  onPress={handleSubmit(onSubmit)}
                >
                  Salvar
                </Button>
                <Button variant="outline" onPress={() => setIsEditing(false)}>
                  Cancelar
                </Button>
              </>
            )}
          </>
        )}

        <Button onPress={goToLogin} colorScheme="red">
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
