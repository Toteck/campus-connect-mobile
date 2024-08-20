import { colors } from "@/styles/colors";
import { MaterialIcons } from "@expo/vector-icons";
import {
  Input as NativeBaseInput,
  IInputProps,
  Icon,
  IModalProps,
} from "native-base";

import {
  Button,
  Modal,
  Center,
  FormControl,
  NativeBaseProvider,
  Select,
  CheckIcon,
  VStack,
  HStack,
  Box,
} from "native-base";

type InputProps = IInputProps & {
  setShowModal: (value: boolean) => void;
  setCategory: (value: string) => void;
  showModal?: boolean;
  category: string;
};

export function Input({
  setShowModal,
  showModal = false,
  category,
  setCategory,
  ...rest
}: InputProps) {
  return (
    <NativeBaseInput
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
  );
}
