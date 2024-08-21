import { StyleSheet, SafeAreaView } from "react-native";
import { PostCard } from "@/components/postCard";
import {
  Actionsheet,
  Badge,
  Box,
  Button,
  FlatList,
  HStack,
  useDisclose,
  Text,
  View,
} from "native-base";
import Header from "@/components/header";
import { mockPosts } from "@/data/mockPosts";

export default function HomeScreen() {
  const { isOpen, onOpen, onClose } = useDisclose();
  return (
    <SafeAreaView style={styles.scrollViewArea}>
      <Box flex={1} alignItems="center" justifyContent="flex-start">
        <Header onOpen={onOpen} />
        <FlatList
          data={mockPosts}
          renderItem={({ item }) => <PostCard item={item} />}
          lineHeight={24}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
        />
      </Box>
      <Actionsheet isOpen={isOpen} onClose={onClose}>
        <Actionsheet.Content>
          <Box w="100%" h={60} px={4} justifyContent="center">
            <Text fontSize="16" color="fuchsia.800" mb={4}>
              Selecione um Filtro
            </Text>
            <HStack justifyContent="flex-start">
              <Button variant="ghost">
                <Badge colorScheme="success">NODE JS</Badge>
              </Button>
              <Button variant="ghost">
                <Badge colorScheme="danger">REACT JS</Badge>
              </Button>
            </HStack>
          </Box>
        </Actionsheet.Content>
      </Actionsheet>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollViewArea: {
    flex: 1,
    paddingTop: 45,
    paddingHorizontal: 4,
  },

  separator: {
    height: 32,
  },
});
