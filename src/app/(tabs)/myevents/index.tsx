import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Box, FlatList, Text, Button, Badge } from "native-base";
import { SafeAreaView, StyleSheet, View } from "react-native";
import Header from "@/components/header";
import { NotificationCard } from "@/components/notificationCard";
import { Notification } from "@/types/notification";
import { useAuth } from "@/context/AuthContext";
import qs from "qs";

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

      // Inicia o filtro de busca pelo perfil do usuário

      let query = `filters[publico_alvo][$eq]=${user?.profile}`;

      //Verifica se o usuário tem modalidade, curso e turma e adiciona aos filtros

      if (user?.modality?.slug) {
        query += `&filters[course_modalities][slug][$eq]=${user?.modality?.slug}`;
      }

      if (user?.course?.slug) {
        query += `&filters[courses][slug][$eq]=${user?.course?.slug}`;
      }

      if (user?.classroom?.slug) {
        query += `&filters[classrooms][slug][$eq]=${user?.classroom?.slug}`;
      }

      // Faz a requisição à API com a query string gerada
      console.log({ query });
      const response = await axios.get(
        `https://devblog-zkbf.onrender.com/api/posts?sort[0]=createdAt:desc&${query}`
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
