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
} from "native-base";
import { useRouter } from "expo-router";
import { useAuth, User } from "@/context/AuthContext";
import { useForm } from "react-hook-form";
import axios from "axios";

type Modality = {
  id: number;
  attributes: {
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    slug: string;
  };
};

type Course = {
  id: number;
  attributes: {
    description: string;
    slug: string;
    createdAt: string;
    updatedAt: string;
    name: string;
  };
};

type Classroom = {
  id: number;
  attributes: {
    slug: string;
    createdAt: string;
    updatedAt: string;
    name: string;
  };
};

export default function ProfileScreen() {
  const { control, handleSubmit, watch, setValue } = useForm();
  const [modalidades, setModalidades] = useState<Modality[]>([]);
  const [cursos, setCursos] = useState<Course[]>([]);
  const [turmas, setTurmas] = useState<Classroom[]>([]);

  const selectedModalidade = watch("modalidade");
  const selectedCurso = watch("curso");
  const selectedTurma = watch("turma");

  const { logout, user, token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Fetch Modalidades from Strapi
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
      // Fetch Cursos based on selected Modalidade
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
      // Fetch Turmas based on selected Curso
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

  const onSubmit = (data: any) => {
    console.log({ data });
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
      .then((response) => {
        console.log("Perfil atualizado com sucesso:", response.data);
      })
      .catch((error) => {
        console.error("Erro ao atualizar perfil:", error);
      });
  };

  const goToLogin = () => {
    logout();
    router.replace("/(auth)/login");
  };

  return (
    <Center flex={1} p={4}>
      <VStack space={4} alignItems="center">
        <Text fontSize="4xl" fontWeight="bold">
          {user?.username}
        </Text>
        <Text fontSize="xl" fontWeight="bold">
          {user?.profile}
        </Text>
        <Divider my={4} />
        <Text textAlign="center" fontSize="md">
          Personalize o conteúdo que você recebe! Escolha a modalidade, curso e
          turma a que você pertence nos botões abaixo!
        </Text>

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

        <Button bgColor={"blue.500"} onPress={handleSubmit(onSubmit)}>
          Salvar
        </Button>
        <Button bgColor={"red.500"} onPress={goToLogin}>
          Sair
        </Button>
      </VStack>
    </Center>
  );
}
