import React from "react";
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
} from "native-base";
import { useRouter } from "expo-router";
import { mockPosts } from "@/data/mockPosts";
export default function PostDetails() {
  const { id } = useLocalSearchParams();

  const post = mockPosts.filter((post) => post.id === id)[0];
  const router = useRouter();

  return (
    <ScrollView>
      <StatusBar barStyle="light-content" />
      <Box>
        <AspectRatio w="100%" ratio={16 / 9}>
          <Image
            source={{
              uri: "https://blog.rocketseat.com.br/content/images/size/w2000/2022/01/Rocketseat-jquery-historia.jpg",
            }}
            alt="image"
          />
        </AspectRatio>
        <Center bg="violet.500" position="absolute" bottom="0">
          <Button variant="ghost" onPress={() => router.back()}>
            <ArrowBackIcon size={8} color="warmGray.50" />
            <Text color="warmGray.50">Voltar</Text>
          </Button>
        </Center>
        <Center
          bg="violet.500"
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
            <Text>{post.createdAt}</Text>
            <Heading mb={4}>{post.title}</Heading>
          </VStack>
        </HStack>
        <Text mb={4}>{post.description}</Text>
      </VStack>
    </ScrollView>
  );
}
