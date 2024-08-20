import { MaterialIcons } from "@expo/vector-icons";
import { Button, IButtonProps, Icon, Text } from "native-base";

type searchAdvancedButtonProps = IButtonProps & {
  setShowModal: (value: boolean) => void;
};

export function SearchAdvancedButton({
  setShowModal,
  ...rest
}: searchAdvancedButtonProps) {
  return (
    <Button
      display={"flex"}
      flexDirection="row"
      alignItems="center"
      justifyItems={"center"}
      mt={2}
      width={"1/3"}
      variant={"ghost"}
      onPress={() => setShowModal(true)}
      {...rest}
    >
      <Text>Busca avançada</Text>
    </Button>
  );
}
