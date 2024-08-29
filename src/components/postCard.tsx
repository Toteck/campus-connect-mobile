import React from "react";
import {
  Box,
  Heading,
  AspectRatio,
  Image,
  Text,
  Center,
  Stack,
  HStack,
  Button,
} from "native-base";
import { useRouter } from "expo-router";
import { Post } from "@/types/post";
import { colors } from "@/styles/colors";

interface PostCardProps {
  item: Post;
}

export function PostCard({ item }: PostCardProps) {
  const router = useRouter();
  const { id, title, content, tag, cover, createdAt } = item;

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
              uri: cover,
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
          {tag}
        </Center>
      </Box>
      <Stack p="4" space={3}>
        <Stack space={2}>
          <Heading size="md" ml="-1">
            {title}
          </Heading>
        </Stack>
        <Text fontWeight="400">{content}</Text>
        <HStack alignItems="center" space={4} justifyContent="space-between">
          <Text
            color="coolGray.600"
            _dark={{
              color: "warmGray.200",
            }}
            fontWeight="400"
          >
            {createdAt}
          </Text>
          <Button bgColor={colors.green[600]} onPress={goToPost}>
            Ver mais...
          </Button>
        </HStack>
      </Stack>
    </Box>
  );
}
