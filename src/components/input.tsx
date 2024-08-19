import { colors } from "@/styles/colors";
import { Text, TextProps, View, ViewProps, TextInput } from "react-native";

function Input({ children }: TextProps) {
  return (
    <View className="w-full h-14 bg-green-800 rounded-lg p-4 flex-row items-center gap-4">
      {children}
    </View>
  );
}

function InputField({ ...rest }: TextProps) {
  return (
    <TextInput
      placeholder="Pesquisar eventos"
      placeholderTextColor={colors.gray[400]}
      cursorColor={colors.blue[600]}
      className="flex-1 font-normal text-base text-white"
    />
  );
}

Input.Field = InputField;

export { Input };
