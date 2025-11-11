import { useCallback, useMemo } from "react";
import { FlatList, Text, View, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import Header from "./components/Header";
import ThreadCard from "./components/ThreadCard";
import ScreenContainer from "./components/layout/ScreenContainer";
import { useForum } from "../src/context/ForumContext";
import { usePreloadScreens } from "../src/hooks/usePreloadScreens";
import { useAppearance } from "../src/context/AppearanceContext";

export default function HomeScreen() {
  const router = useRouter();
  const { posts, categories } = useForum();
  const { colors, spacing, radius, fonts } = useAppearance();
  const contentPadding = useMemo(
    () => ({
      paddingHorizontal: spacing(2),
      paddingTop: spacing(2),
      paddingBottom: spacing(4),
      flexGrow: posts.length === 0 ? 1 : 0,
    }),
    [posts.length]
  );

  const preloadTargets = useMemo(
    () => [
      "/settings",
      "/login",
      "/post/create",
      "/scoop-forum",
      ...categories.map((category) => ({
        pathname: "/forum/[category]",
        params: { category: category.key, title: category.label },
      })),
      ...posts.map((post) => ({
        pathname: "/post/[id]",
        params: { id: post.id },
      })),
    ],
    [categories, posts]
  );

  usePreloadScreens(preloadTargets);

  const handleNavigateToThread = useCallback(
    (id) => () => {
      router.push({ pathname: "/post/[id]", params: { id } });
    },
    [router]
  );

  const renderThread = useCallback(
    ({ item }) => (
      <ThreadCard
        title={item.title}
        author={item.author}
        tagLabel={item.tag}
        views={item.views}
        comments={item.comments}
        onPress={handleNavigateToThread(item.id)}
      />
    ),
    [handleNavigateToThread]
  );

  const keyExtractor = useCallback((item) => item.id, []);

  return (
    <ScreenContainer>
      <Header title="רוֹטר.נט – סקופים" subtitle="פורום חדשות ודיונים" />
      <FlatList
        data={posts}
        keyExtractor={keyExtractor}
        renderItem={renderThread}
        style={{ flex: 1 }}
        contentContainerStyle={contentPadding}
        initialNumToRender={6}
        windowSize={5}
        removeClippedSubviews
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              paddingVertical: spacing(10),
            }}
          >
            <Text style={{ color: colors.textMuted, fontSize: fonts.body }}>
              עדיין לא נוצרו פוסטים. בואו נהיה הראשונים!
            </Text>
          </View>
        )}
      />
      <TouchableOpacity
        onPress={() => router.push("/post/create")}
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
        accessibilityLabel="יצירת פוסט חדש"
        activeOpacity={0.9}
      >
        <Text
          style={{
            color: colors.surface,
            fontWeight: "700",
            fontSize: fonts.body,
          }}
        >
          כתיבה חדשה
        </Text>
      </TouchableOpacity>
    </ScreenContainer>
  );
}
