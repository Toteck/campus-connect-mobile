import { Pressable } from "react-native";
// Icones da própria google disponivel dentro do própria expo
import { MaterialIcons } from "@expo/vector-icons";
import { colors } from "@/styles/colors";
export function SearchAdvancedButton() {
  console.log("Clicado no Search Advanced");
  return (
    <Pressable>
      <MaterialIcons name="settings" size={22} color={colors.white} />
    </Pressable>
  );
}
