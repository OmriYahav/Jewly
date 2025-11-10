import { SafeAreaView, View, FlatList, StatusBar } from "react-native";
import Header from "./components/Header";
import PostCard from "./components/PostCard";
import { posts } from "../data/posts";
import { useResponsiveValues } from "./hooks/useResponsiveValues";

export default function HomeScreen() {
  const { containerPadding, cardSpacing } = useResponsiveValues();

  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar barStyle="light-content" backgroundColor="#0C0F14" />
      <Header title="רוטר.נט" subtitle="פורום חדשות ודיונים" />
      <View
        className="flex-1"
        style={{ paddingHorizontal: containerPadding, paddingBottom: cardSpacing }}
      >
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <PostCard post={item} />}
          contentContainerStyle={{ paddingBottom: cardSpacing * 5 }}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
}
