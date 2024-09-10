import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import {
  Box,
  Heading,
  AspectRatio,
  Image,
  Text,
  Center,
  VStack,
  ScrollView,
  HStack,
  ArrowBackIcon,
  StatusBar,
  Button,
  Icon,
  Link,
} from "native-base";
import { useRouter } from "expo-router";
import { Post } from "@/types/post";
import { MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import { format } from "date-fns";
import { usePostCache } from "@/context/PostCacheContext";

export default function PostDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { cache, setCache } = usePostCache();
  const [post, setPost] = useState<Post | null>(cache[id as string] || null);
  const [loading, setLoading] = useState(!post);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(
          `https://devblog-zkbf.onrender.com/api/posts/${id}?populate=tag,cover,anexos`
        );
        const postData = response.data.data;
        const newPost = {
          id: postData.id.toString(),
          title: postData.attributes.title,
          content: postData.attributes.content,
          cover: postData.attributes.cover.data[0]?.attributes.url || "",
          tag: postData.attributes.tag.data?.attributes.name || "",
          createdAt: postData.attributes.createdAt,
          anexos: postData.attributes.anexos.map((anexo: any) => ({
            id: anexo.id.toString(),
            title: anexo.title,
            url: anexo.url,
          })),
        };
        setPost(newPost);
        setCache(id as string, newPost);
      } catch (error) {
        console.error("Erro ao buscar o post:", error);
      } finally {
        setLoading(false);
      }
    };

    if (!post && id) {
      fetchPost();
    }
  }, [id, post, setCache]);

  if (loading || !post) {
    return <Text>Carregando...</Text>;
  }

  return (
    <ScrollView>
      <StatusBar barStyle="light-content" />
      <Box>
        <AspectRatio w="100%" ratio={16 / 9}>
          <Image
            source={{
              uri: post.cover || "https://via.placeholder.com/150",
            }}
            alt="image"
          />
        </AspectRatio>
        <Center bg="green.500" position="absolute" bottom="0">
          <Button variant="ghost" onPress={() => router.back()}>
            <ArrowBackIcon size={8} color="warmGray.50" />
            <Text color="warmGray.50">Voltar</Text>
          </Button>
        </Center>
        <Center
          bg="green.500"
          _dark={{
            bg: "violet.400",
          }}
          _text={{
            color: "warmGray.50",
            fontWeight: "700",
            fontSize: "xs",
          }}
          position="absolute"
          bottom="0"
          right="0"
          px="3"
          py="1.5"
        >
          {post.tag}
        </Center>
      </Box>
      <VStack mt={4} px={4}>
        <HStack>
          <VStack>
            <Text mb={"2"}>
              Publicado em: {format(new Date(post.createdAt), "dd/MM/yyyy")}
            </Text>
            <Heading mb={4}>{post.title}</Heading>
          </VStack>
        </HStack>
        <Text mb={4} fontSize={"md"}>
          {post.content}
        </Text>

        {post.anexos.length > 0 && (
          <>
            <VStack space={3} mt={4}>
              <Heading size="md">Anexos</Heading>
              {post.anexos.map((anexo) => (
                <HStack key={anexo.id} alignItems="center" space={2}>
                  <Icon
                    as={MaterialIcons}
                    name="attach-file"
                    size="sm"
                    color="blue.500"
                  />
                  <Link
                    href={anexo.url}
                    isExternal
                    _text={{ color: "blue.500" }}
                  >
                    {anexo.title}
                  </Link>
                </HStack>
              ))}
            </VStack>
          </>
        )}
      </VStack>
    </ScrollView>
  );
}
