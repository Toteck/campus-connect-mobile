import React, { useEffect } from "react";
import { Box, Heading, Center, Stack, Text, HStack, Button } from "native-base";
import { useRouter } from "expo-router";
import { Notification } from "@/types/notification";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface NotificationCardProps {
  item: Notification;
}

export function NotificationCard({ item }: NotificationCardProps) {
  const router = useRouter();

  const goToPost = () => {
    router.push(`/home/${item.id}`);
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
      <Stack p="4" space={3}>
        <HStack
          space={2}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <Heading size="md" ml="-1">
            {item.title}
          </Heading>
          <Text
            bg="green.500"
            _dark={{
              bg: "violet.400",
            }}
            padding={"0.5"}
            color="gray.50"
            rounded={"sm"}
          >
            {item.tag.toUpperCase()}
          </Text>
        </HStack>
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
              {item.createdAt}
            </Text>
          </HStack>

          <Button bgColor={"green.500"} onPress={goToPost}>
            Ver mais...
          </Button>
        </HStack>
      </Stack>
    </Box>
  );
}
