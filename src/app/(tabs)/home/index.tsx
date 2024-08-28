import { StyleSheet, SafeAreaView, ActivityIndicator } from "react-native";
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
import { useEffect, useState } from "react";
import axios from "axios";

export default function HomeScreen() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("http://192.168.19.1:1337/api/posts");
        const data = await response.json();
        console.log({ data });
        setPosts(data.data);
      } catch (error) {
        console.error("Erro ao buscar os posts com fetch:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // if (loading) {
  //   return <ActivityIndicator size="large" color="#0000ff" />;
  // }

  return (
    <SafeAreaView style={styles.scrollViewArea}>
      <Box flex={1} alignItems="center" justifyContent="flex-start">
        <Header />

        {loading ? (
          <ActivityIndicator
            className="flex-1 justify-center items-center"
            size="large"
            color="#0000ff"
          />
        ) : (
          <FlatList
            data={mockPosts}
            renderItem={({ item }) => <PostCard item={item} />}
            lineHeight={24}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
          />
        )}
      </Box>
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
