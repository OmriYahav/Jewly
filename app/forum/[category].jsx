import { useCallback, useMemo } from "react";
import { View, FlatList, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import Header from "../components/Header";
import PostCard from "../components/PostCard";
import ScreenContainer from "../components/layout/ScreenContainer";
import { posts, forumCategories } from "../../data/posts";
import { useResponsiveValues } from "../hooks/useResponsiveValues";

export default function ForumCategoryScreen() {
  const { category } = useLocalSearchParams();
  const normalizedCategory = Array.isArray(category) ? category[0] : category;
  const forum = useMemo(
    () => forumCategories.find((item) => item.key === normalizedCategory),
    [normalizedCategory]
  );
  const filteredPosts = useMemo(
    () => posts.filter((item) => item.category === normalizedCategory),
    [normalizedCategory]
  );
  const { containerPadding, cardSpacing, metaFontSize } = useResponsiveValues();
  const listPadding = useMemo(
    () => ({ paddingBottom: cardSpacing * 5 }),
    [cardSpacing]
  );

  const keyExtractor = useCallback((item) => item.id, []);
  const renderPost = useCallback(({ item }) => <PostCard post={item} />, []);

  return (
    <ScreenContainer>
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
            keyExtractor={keyExtractor}
            renderItem={renderPost}
            initialNumToRender={6}
            maxToRenderPerBatch={8}
            windowSize={4}
            removeClippedSubviews
            contentContainerStyle={listPadding}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </ScreenContainer>
  );
}
