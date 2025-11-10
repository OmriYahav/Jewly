import { useCallback, useMemo } from "react";
import { View, FlatList } from "react-native";
import Header from "./components/Header";
import PostCard from "./components/PostCard";
import ScreenContainer from "./components/layout/ScreenContainer";
import { posts, forumCategories } from "../data/posts";
import { useResponsiveValues } from "./hooks/useResponsiveValues";
import { usePreloadScreens } from "./hooks/usePreloadScreens";

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
  const { containerPadding, cardSpacing } = useResponsiveValues();
  const listContentPadding = useMemo(
    () => ({ paddingBottom: cardSpacing * 5 }),
    [cardSpacing]
  );

  const keyExtractor = useCallback((item) => item.id, []);
  const renderPost = useCallback(({ item }) => <PostCard post={item} />, []);

  usePreloadScreens(PRELOAD_ROUTES);

  return (
    <ScreenContainer>
      <Header title="רוטר.נט" subtitle="פורום חדשות ודיונים" />
      <View
        className="flex-1"
        style={{ paddingHorizontal: containerPadding, paddingBottom: cardSpacing }}
      >
        <FlatList
          data={posts}
          keyExtractor={keyExtractor}
          renderItem={renderPost}
          initialNumToRender={6}
          maxToRenderPerBatch={8}
          windowSize={5}
          removeClippedSubviews
          contentContainerStyle={listContentPadding}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </ScreenContainer>
  );
}
