import { StyleSheet, SafeAreaView, ActivityIndicator } from "react-native";
import { PostCard } from "@/components/postCard";
import { Box, FlatList, View } from "native-base";
import Header from "@/components/header";
import { useEffect, useState } from "react";

import { Post } from "@/types/post";

export default function HomeScreen() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(
          "https://devblog-zkbf.onrender.com/api/posts?fields[0]=title&fields[1]=content&populate[tag][fields][0]=name&populate[cover][fields][0]=url&populate[anexos][fields][0]=title&populate[anexos][fields][1]=url"
        );
        const data = await response.json();

        const extractedPosts = data.data.map((postData: any) => ({
          id: postData.id,
          title: postData.attributes.title,
          content: postData.attributes.content,
          tag: postData.attributes.tag.data.attributes.name,
          cover: postData.attributes.cover.data[0]?.attributes.url,
          anexos: postData.attributes.anexos.map((anexo: any) => ({
            id: anexo.id,
            title: anexo.title,
            url: anexo.url,
          })),
        }));

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
        <Header />
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
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
