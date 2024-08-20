import React from "react";
import {
  Modal,
  FormControl,
  Select,
  CheckIcon,
  Button,
  HStack,
} from "native-base";

type SearchAdvancedModalProps = {
  isOpen: boolean;
  onClose: () => void;
  category: string;
  setCategory: (value: string) => void;
};

export function SearchAdvancedModal({
  isOpen,
  onClose,
  category,
  setCategory,
}: SearchAdvancedModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
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
                /* Lógica para aplicar filtro */ onClose();
              }}
            >
              Aplicar
            </Button>
          </HStack>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
}
