import { SafeAreaView, View, FlatList, Text, StatusBar } from "react-native";
import { useLocalSearchParams } from "expo-router";
import Header from "../components/Header";
import PostCard from "../components/PostCard";
import { posts, forumCategories } from "../../data/posts";
import { useResponsiveValues } from "../hooks/useResponsiveValues";

export default function ForumCategoryScreen() {
  const { category } = useLocalSearchParams();
  const forum = forumCategories.find((item) => item.key === category);
  const filteredPosts = posts.filter((item) => item.category === category);
  const { containerPadding, cardSpacing, metaFontSize } = useResponsiveValues();

  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar barStyle="light-content" backgroundColor="#0C0F14" />
      <Header title={forum?.label ?? "פורום"} subtitle="הדיונים החמים ביותר" />
      <View
        className="flex-1"
        style={{ paddingHorizontal: containerPadding, paddingBottom: cardSpacing }}
      >
        {filteredPosts.length === 0 ? (
          <View className="flex-1 items-center justify-center">
            <Text
              className="text-text/60"
              style={{ fontSize: metaFontSize }}
            >
              אין פוסטים להצגה כרגע
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredPosts}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <PostCard post={item} />}
            contentContainerStyle={{ paddingBottom: cardSpacing * 5 }}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
