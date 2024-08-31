import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Box, FlatList, Text, Button, Badge } from "native-base";
import { SafeAreaView, StyleSheet, View } from "react-native";
import Header from "@/components/header";
import { NotificationCard } from "@/components/notificationCard";
import { Notification } from "@/types/notification";
import { useAuth } from "@/context/AuthContext";

export default function MyEventsScreen() {
  const [events, setEvents] = useState<Notification[]>([]);
  const [newEventsCount, setNewEventsCount] = useState(0);

  const { user } = useAuth();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const lastViewedTimestamp = await AsyncStorage.getItem(
        "lastViewedTimestamp"
      );
      const response = await axios.get(
        `https://devblog-zkbf.onrender.com/api/posts?filters[publico_alvo][$eq]=${user?.profile}&sort=createdAt:desc`
      );

      const fetchedEvents = response.data.data.map((event: any) => ({
        id: event.id.toString(),
        title: event.attributes.title,
        description: event.attributes.content,
        createdAt: event.attributes.createdAt,
        tag: event.attributes.publico_alvo,
      }));

      setEvents(fetchedEvents);

      const newEvents = fetchedEvents.filter(
        (event: Notification) =>
          new Date(event.createdAt) > new Date(lastViewedTimestamp || 0)
      );

      setNewEventsCount(newEvents.length);
    } catch (error) {
      console.error("Erro ao buscar eventos:", error);
    }
  };

  const handleViewEvents = async () => {
    await AsyncStorage.setItem("lastViewedTimestamp", new Date().toISOString());
    setNewEventsCount(0);
  };

  return (
    <SafeAreaView style={styles.scrollViewArea}>
      <Box flex={1} alignItems="center" justifyContent="flex-start">
        <Header title="Meus eventos" />
        <Badge colorScheme="red" rounded="full" mb={4}>
          {newEventsCount} novos eventos
        </Badge>
        <FlatList
          data={events}
          renderItem={({ item }) => <NotificationCard item={item} />}
          lineHeight={24}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
        />
        <Button onPress={handleViewEvents}>Marcar como visto</Button>
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
