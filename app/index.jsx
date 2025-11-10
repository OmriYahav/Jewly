import { useCallback, useMemo } from "react";
import { FlatList } from "react-native";
import { useRouter } from "expo-router";
import Header from "./components/Header";
import ThreadCard from "./components/ThreadCard";
import ScreenContainer from "./components/layout/ScreenContainer";
import { posts, forumCategories } from "../data/posts";
import { usePreloadScreens } from "./hooks/usePreloadScreens";
import { spacing } from "../src/theme";

const PRELOAD_ROUTES = [
  "/settings",
  "/login",
  ...forumCategories.map((category) => ({
    pathname: "/forum/[category]",
    params: { category: category.key, title: category.label },
  })),
  ...posts.map((post) => ({
    pathname: "/post/[id]",
    params: { id: post.id },
  })),
];

export default function HomeScreen() {
  const router = useRouter();
  const contentPadding = useMemo(
    () => ({
      paddingHorizontal: spacing(2),
      paddingTop: spacing(2),
      paddingBottom: spacing(4),
    }),
    []
  );

  usePreloadScreens(PRELOAD_ROUTES);

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
      />
    </ScreenContainer>
  );
}
