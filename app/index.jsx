import { useCallback, useMemo, useRef } from "react";
import { Animated, Text, View } from "react-native";
import { useRouter } from "expo-router";
import AppHeader from "../components/AppHeader";
import PostCard from "../components/PostCard";
import FloatingActionButton from "../components/FloatingActionButton";
import { withScreenWrapper } from "./components/layout/ScreenWrapper";
import { useForum } from "../src/context/ForumContext";
import { usePreloadScreens } from "../src/hooks/usePreloadScreens";
import { useAppearance } from "../src/context/AppearanceContext";

function HomeScreen() {
  const router = useRouter();
  const { posts, categories } = useForum();
  const { colors, spacing, fonts, fontFamily } = useAppearance();
  const scrollY = useRef(new Animated.Value(0)).current;
  const contentPadding = useMemo(
    () => ({
      paddingHorizontal: spacing(2),
      paddingTop: spacing(1.5),
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
    ({ item, index }) => (
      <PostCard
        title={item.title}
        author={item.author}
        tagLabel={item.tag}
        views={item.views}
        comments={item.comments}
        index={index}
        onPress={handleNavigateToThread(item.id)}
      />
    ),
    [handleNavigateToThread]
  );

  const keyExtractor = useCallback((item) => item.id, []);

  return (
    <>
      <AppHeader title="Jewly" scrollY={scrollY} />
      <Animated.FlatList
        data={posts}
        keyExtractor={keyExtractor}
        renderItem={renderThread}
        style={{ flex: 1 }}
        contentContainerStyle={contentPadding}
        initialNumToRender={6}
        windowSize={5}
        removeClippedSubviews
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        ListEmptyComponent={() => (
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              paddingVertical: spacing(10),
            }}
          >
            <Text
              style={{
                color: colors.textMuted,
                fontSize: fonts.body,
                fontFamily,
                textAlign: "center",
              }}
            >
              עדיין לא נוצרו פוסטים. בואו נהיה הראשונים!
            </Text>
          </View>
        )}
      />
      <FloatingActionButton onPress={() => router.push("/post/create")} />
    </>
  );
}

export default withScreenWrapper(HomeScreen);
