import { StyleSheet, SafeAreaView, ActivityIndicator } from "react-native";
import { PostCard } from "@/components/postCard";
import { Box, Center, FlatList, View } from "native-base";
import Header from "@/components/header";
import { useEffect, useState } from "react";

import { Post } from "@/types/post";
import { useAuth } from "@/context/AuthContext";
import { Redirect, useRouter } from "expo-router";

export default function HomeScreen() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/(auth)/login");
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(
          "https://devblog-zkbf.onrender.com/api/posts?fields[0]=title&fields[1]=content&populate[tag][fields][0]=name&populate[cover][fields][0]=url"
        );
        const data = await response.json();

        const extractedPosts = data.data.map((postData: any) => {
          return {
            id: postData.id,
            title: postData.attributes.title,
            content: postData.attributes.content,
            tag: postData.attributes.tag.data.attributes.name,
            cover: postData.attributes.cover.data[0]?.attributes.url,
          };
        });
        setPosts(extractedPosts);
      } catch (error) {
        console.error("Erro ao buscar os posts com fetch:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <SafeAreaView style={styles.scrollViewArea}>
      <Box flex={1} alignItems="center" justifyContent="flex-start">
        <Header title="Campus Connect" />
        {loading ? (
          <Box flex={1} alignItems={"center"} justifyContent={"center"}>
            <ActivityIndicator size="large" color="#00ff00" />
          </Box>
        ) : (
          <FlatList
            data={posts}
            renderItem={({ item }) => <PostCard item={item} />}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            keyExtractor={(item) => item.id.toString()}
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
