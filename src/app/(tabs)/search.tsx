import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import {
  Icon,
  Input,
  Button,
  Modal,
  FormControl,
  Select,
  CheckIcon,
  HStack,
  Box,
  FlatList,
  Text,
  Center,
  VStack,
} from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import qs from "qs";

import { PostCard } from "@/components/postCard";
import { Post } from "@/types/post";
import { ActivityIndicator } from "react-native";
import Header from "@/components/header";

export default function SearchScreen() {
  const [showModal, setShowModal] = useState(false);
  const [category, setCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);

    try {
      const filters: any = {
        // Filtra por título e conteúdo de forma insensível a maiúsculas e minúsculas
        title: { $containsi: searchQuery },
        content: { $containsi: searchQuery },
      };

      // Se uma categoria (tag) foi selecionada, adiciona ao filtro
      if (category) {
        filters.tag = {
          name: { $containsi: category },
        };
      }

      const query = qs.stringify(
        {
          filters: filters,
          // Definindo os campos que deseja retornar
          fields: ["title", "content", "createdAt"],
          // Populando as tags e covers com seus respectivos campos
          populate: {
            tag: {
              fields: ["name"],
            },
            cover: {
              fields: ["url"],
            },
          },
          // Ordenando por título em ordem ascendente
          sort: ["title:asc"],
        },
        {
          encodeValuesOnly: true, // Prettify URL
        }
      );

      const response = await axios.get(
        `https://devblog-zkbf.onrender.com/api/posts?${query}`
      );

      const posts = response.data.data.map((post: any) => ({
        id: post.id.toString(),
        title: post.attributes.title,
        content: post.attributes.content,
        cover: post.attributes.cover?.data
          ? post.attributes.cover.data[0]?.attributes.url
          : "",
        tag: post.attributes.tag?.data
          ? post.attributes.tag.data.attributes.name
          : "",
        createdAt: post.attributes.createdAt,
      }));
      setResults(posts);
    } catch (error) {
      console.error("Erro ao buscar eventos:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box flex={1} bg="white" pt={16} px={4}>
      <Header title="Buscar Eventos" />
      <HStack maxWidth={"full"} space={1} alignItems="center">
        <Input
          placeholder="Pesquisar eventos"
          placeholderTextColor="rgba(255, 255, 255, 0.6)" // Cor suave para o placeholder
          variant="filled"
          bg="green.600" // Cor de fundo do input em tom de verde
          flex={1}
          borderRadius="10"
          py="3"
          px="4" // Padding maior para o input
          fontSize="md" // Tamanho de fonte médio
          value={searchQuery}
          onChangeText={setSearchQuery}
          color="white" // Cor do texto dentro do input
          _focus={{
            bg: "green.600", // Manter o fundo verde ao focar
            borderColor: "green.700", // Cor da borda ao focar
          }}
        />
        <Button
          onPress={handleSearch}
          bg="green.700" // Botão em tom de verde
          rounded={"md"}
          justifyContent={"center"}
          alignItems={"center"}
          paddingRight={"4"}
          paddingLeft={"4"}
          py={3}
          _pressed={{ bg: "green.800" }} // Cor do botão quando pressionado
        >
          <Icon size="7" color="white" as={<MaterialIcons name="search" />} />
        </Button>
      </HStack>

      <HStack justifyContent="space-between" alignItems="center" mt={2}>
        <Button
          variant="ghost"
          onPress={() => setShowModal(true)}
          leftIcon={<MaterialIcons size={18} name="settings" />}
        >
          Filtrar por tipo de evento
        </Button>
      </HStack>

      {/* Modal de Pesquisa Avançada */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} size="lg">
        <Modal.Content maxWidth="400px">
          <Modal.CloseButton />
          <Modal.Header>Pesquisa Avançada</Modal.Header>
          <Modal.Body>
            <FormControl>
              <FormControl.Label>Categoria</FormControl.Label>
              <Select
                selectedValue={category}
                minWidth="200"
                flex={1}
                accessibilityLabel="Escolha a categoria"
                placeholder="Escolha a categoria"
                _selectedItem={{
                  bg: "teal.600",
                  endIcon: <CheckIcon size="5" />,
                }}
                mt={1}
                onValueChange={(value) => setCategory(value)}
              >
                <Select.Item label="Edital" value="Edital" />
                <Select.Item label="Aviso" value="Aviso" />
                <Select.Item label="Notícia" value="Notícia" />
                <Select.Item label="Reunião" value="Reunião" />
              </Select>
            </FormControl>
          </Modal.Body>
          <Modal.Footer>
            <HStack space={2}>
              <Button colorScheme="red" onPress={() => setCategory("")}>
                Limpar
              </Button>
              <Button
                onPress={() => {
                  setShowModal(false);
                }}
              >
                Aplicar
              </Button>
            </HStack>
          </Modal.Footer>
        </Modal.Content>
      </Modal>

      {/* Resultados da Busca */}
      <Box flex={1} mt={4}>
        {loading ? (
          <Box flex={1} justifyContent={"center"} alignItems={"center"}>
            <ActivityIndicator size="large" color="#00ff00" />
          </Box>
        ) : results.length > 0 ? (
          <FlatList
            data={results}
            keyExtractor={(item: Post) => item.id.toString()}
            renderItem={({ item }) => <PostCard item={item} />}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        ) : (
          <Center>
            <Text>Nenhum evento encontrado para essa busca!</Text>
          </Center>
        )}
      </Box>
    </Box>
  );
}

const styles = StyleSheet.create({
  scrollViewArea: {
    flex: 1,
    paddingTop: 45,
    paddingHorizontal: 4,
  },
  separator: {
    height: 20,
  },
});
