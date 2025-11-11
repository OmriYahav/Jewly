import { useCallback, useMemo } from "react";
import { View, FlatList, Text, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import Header from "../components/Header";
import ThreadCard from "../components/ThreadCard";
import { withScreenWrapper } from "../components/layout/ScreenWrapper";
import { useForum } from "../../src/context/ForumContext";
import { useAppearance } from "../../src/context/AppearanceContext";

function ForumCategoryScreen() {
  const { category } = useLocalSearchParams();
  const router = useRouter();
  const { posts, categories } = useForum();
  const { spacing, colors, fonts, radius } = useAppearance();
  const normalizedCategory = Array.isArray(category) ? category[0] : category;
  const forum = useMemo(
    () => categories.find((item) => item.key === normalizedCategory),
    [categories, normalizedCategory]
  );
  const filteredPosts = useMemo(
    () => posts.filter((item) => item.category === normalizedCategory),
    [normalizedCategory, posts]
  );

  const listPadding = useMemo(
    () => ({
      paddingHorizontal: spacing(2),
      paddingTop: spacing(2),
      paddingBottom: spacing(4),
      direction: "rtl",
      flexGrow: filteredPosts.length === 0 ? 1 : 0,
    }),
    [filteredPosts.length]
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
    <>
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
              אין פוסטים להצגה כרגע. היו הראשונים לפתוח דיון!
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
      <TouchableOpacity
        onPress={() => {
          if (forum) {
            router.push({ pathname: "/post/create", params: { category: forum.key } });
          } else {
            router.push("/post/create");
          }
        }}
        style={{
          position: "absolute",
          bottom: spacing(3),
          right: spacing(3),
          backgroundColor: colors.brand,
          borderRadius: radius.lg,
          paddingVertical: spacing(1.75),
          paddingHorizontal: spacing(3),
          shadowColor: "rgba(30, 119, 195, 0.35)",
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.4,
          shadowRadius: 20,
          elevation: 8,
        }}
        accessibilityRole="button"
        accessibilityLabel="פתיחת פוסט חדש"
        activeOpacity={0.9}
      >
        <Text
          style={{
            color: colors.surface,
            fontWeight: "700",
            fontSize: fonts.body,
          }}
        >
          פוסט חדש
        </Text>
      </TouchableOpacity>
    </>
  );
}

export default withScreenWrapper(ForumCategoryScreen);
