import { View } from "react-native";

import { Input } from "@/components/input";
import { MaterialIcons } from "@expo/vector-icons";
import { colors } from "@/styles/colors";
import { SearchAdvancedButton } from "@/components/searchAdvanced-button";

export default function SearchScreen() {
  return (
    <View className="flex-1 bg-white pt-14 p-4">
      <Input>
        <MaterialIcons name="search" size={22} color={colors.white} />
        <Input.Field />
        <SearchAdvancedButton />
      </Input>
    </View>
  );
}
