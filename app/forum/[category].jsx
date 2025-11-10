import { useCallback, useMemo } from "react";
import { View, FlatList, Text } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import Header from "../components/Header";
import ThreadCard from "../components/ThreadCard";
import ScreenContainer from "../components/layout/ScreenContainer";
import { posts, forumCategories } from "../../data/posts";
import { spacing, colors, fonts } from "../../src/theme";

export default function ForumCategoryScreen() {
  const { category } = useLocalSearchParams();
  const router = useRouter();
  const normalizedCategory = Array.isArray(category) ? category[0] : category;
  const forum = useMemo(
    () => forumCategories.find((item) => item.key === normalizedCategory),
    [normalizedCategory]
  );
  const filteredPosts = useMemo(
    () => posts.filter((item) => item.category === normalizedCategory),
    [normalizedCategory]
  );

  const listPadding = useMemo(
    () => ({
      paddingHorizontal: spacing(2),
      paddingTop: spacing(2),
      paddingBottom: spacing(4),
      direction: "rtl",
    }),
    []
  );

  const renderThread = useCallback(
    ({ item }) => (
      <ThreadCard
        title={item.title}
        author={item.author}
        tagLabel={item.tag}
        views={item.views}
        comments={item.comments}
        onPress={() => router.push({ pathname: "/post/[id]", params: { id: item.id } })}
      />
    ),
    [router]
  );

  const keyExtractor = useCallback((item) => item.id, []);

  return (
    <ScreenContainer>
      <Header title={forum?.label ?? "פורום"} subtitle="הדיונים החמים ביותר" />
      <View style={{ flex: 1 }}>
        {filteredPosts.length === 0 ? (
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              paddingHorizontal: spacing(3),
            }}
          >
            <Text style={{ color: colors.textMuted, fontSize: fonts.body, textAlign: "center" }}>
              אין פוסטים להצגה כרגע
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredPosts}
            keyExtractor={keyExtractor}
            renderItem={renderThread}
            style={{ flex: 1 }}
            contentContainerStyle={listPadding}
            initialNumToRender={6}
            windowSize={4}
            removeClippedSubviews
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </ScreenContainer>
  );
}
