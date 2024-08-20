import React, { useState } from "react";
import {
  Icon,
  Input,
  Button,
  Modal,
  FormControl,
  Select,
  CheckIcon,
  VStack,
  HStack,
  Box,
} from "native-base";
import { MaterialIcons } from "@expo/vector-icons";

export default function SearchScreen() {
  const [showModal, setShowModal] = useState(false);
  const [category, setCategory] = useState("");

  return (
    <Box flex={1} bg="white" pt={16} px={4}>
      <Input
        placeholder="Pesquisar eventos"
        variant="filled"
        width="100%"
        bg="green.800"
        borderRadius="10"
        py="3"
        px="2"
        InputLeftElement={
          <Icon
            ml="2"
            size="5"
            color="white"
            as={<MaterialIcons name="search" />}
          />
        }
      />

      <HStack justifyContent="flex-end" alignItems="center" mt={2}>
        <Button
          variant="ghost"
          onPress={() => setShowModal(true)}
          leftIcon={<MaterialIcons size={18} name="settings" />}
        >
          Filtrar
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
                  /* Lógica para aplicar filtro */ setShowModal(false);
                }}
              >
                Aplicar
              </Button>
            </HStack>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </Box>
  );
}
