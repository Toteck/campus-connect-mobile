import Header from "@/components/header";
import { NotificationCard } from "@/components/notificationCard";
import { mockNotification } from "@/data/mockNotifactions";
import { Box, FlatList } from "native-base";
import { StyleSheet, Text, View, SafeAreaView } from "react-native";

export default function MyEventsScreen() {
  return (
    <SafeAreaView style={styles.scrollViewArea}>
      <Box flex={1} alignItems="center" justifyContent="flex-start">
        <Header title="Meus eventos" />
        <FlatList
          data={mockNotification}
          renderItem={({ item }) => <NotificationCard item={item} />}
          lineHeight={24}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
        />
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
