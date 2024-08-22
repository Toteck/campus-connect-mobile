import React from "react";
import {
  Box,
  Heading,
  AspectRatio,
  Image,
  Text,
  Center,
  HStack,
  Stack,
  Button,
  Alert,
} from "native-base";

import { useRouter, Link, useLocalSearchParams } from "expo-router";
import { Post } from "@/types/post";
import { colors } from "@/styles/colors";

interface PostCardProps {
  item: Post;
}

export function PostCard({ item }: PostCardProps) {
  const router = useRouter();

  const { id } = item;

  const goToPost = () => {
    router.push(`/home/${id}`);
  };
  return (
    <Box
      maxW="96"
      rounded="lg"
      overflow="hidden"
      borderColor="coolGray.200"
      borderWidth="1"
      _dark={{
        borderColor: "coolGray.600",
        backgroundColor: "gray.700",
      }}
      _web={{
        shadow: 2,
        borderWidth: 0,
      }}
      _light={{
        backgroundColor: "gray.50",
      }}
    >
      <Box>
        <AspectRatio w="100%" ratio={16 / 9}>
          <Image
            source={{
              uri: "https://blog.rocketseat.com.br/content/images/size/w2000/2022/01/Rocketseat-jquery-historia.jpg",
            }}
            alt="image"
          />
        </AspectRatio>
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
          px="3"
          py="1.5"
        >
          {item.tag}
        </Center>
      </Box>
      <Stack p="4" space={3}>
        <Stack space={2}>
          <Heading size="md" ml="-1">
            {item.title}
          </Heading>
        </Stack>
        <Text fontWeight="400">{item.description}</Text>
        <HStack alignItems="center" space={4} justifyContent="space-between">
          <HStack alignItems="center">
            <Text
              color="coolGray.600"
              _dark={{
                color: "warmGray.200",
              }}
              fontWeight="400"
            >
              6 mins ago
            </Text>
          </HStack>

          <Button bgColor={colors.green[600]} onPress={goToPost}>
            Ver mais...
          </Button>
        </HStack>
      </Stack>
    </Box>
  );
}
