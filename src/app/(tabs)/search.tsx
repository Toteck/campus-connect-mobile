import { StyleSheet, Text, View } from "react-native";

import { Input } from "@/components/input";
import { MaterialIcons } from "@expo/vector-icons";
import { colors } from "@/styles/colors";

export default function SearchScreen() {
  return (
    <View className="flex-1 bg-gray-900 pt-14 p-4">
      <Input>
        <MaterialIcons name="search" size={22} color={colors.white} />
        <Input.Field />
      </Input>
    </View>
  );
}
