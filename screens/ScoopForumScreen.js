import { useCallback, useMemo, useRef } from "react";
import { Animated, Text, View } from "react-native";
import { useRouter } from "expo-router";
import AppHeader from "../components/AppHeader";
import PostCard from "../components/PostCard";
import FloatingActionButton from "../components/FloatingActionButton";
import { withScreenWrapper } from "../app/components/layout/ScreenWrapper";
import { useForum } from "../src/context/ForumContext";
import { useAppearance } from "../src/context/AppearanceContext";

function ScoopForumScreen() {
  const router = useRouter();
  const { posts } = useForum();
  const { colors, spacing, fonts, fontFamily } = useAppearance();
  const scrollY = useRef(new Animated.Value(0)).current;

  const scoopPosts = useMemo(
    () => posts.filter((item) => item.category === "scoops"),
    [posts]
  );

  const contentPadding = useMemo(
    () => ({
      paddingHorizontal: spacing(2),
      paddingTop: spacing(2),
      paddingBottom: spacing(4),
      flexGrow: scoopPosts.length === 0 ? 1 : 0,
    }),
    [scoopPosts.length, spacing]
  );

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
      <AppHeader title="סקופים" subtitle="כל הדיווחים החמים בזמן אמת" scrollY={scrollY} />
      {scoopPosts.length === 0 ? (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: spacing(3),
          }}
        >
          <Text
            style={{
              color: colors.textMuted,
              fontSize: fonts.body,
              textAlign: "center",
              fontFamily,
            }}
          >
            אין עדיין סקופים.
          </Text>
        </View>
      ) : (
        <Animated.FlatList
          data={scoopPosts}
          keyExtractor={keyExtractor}
          renderItem={renderThread}
          style={{ flex: 1 }}
          contentContainerStyle={contentPadding}
          initialNumToRender={6}
          windowSize={4}
          removeClippedSubviews
          showsVerticalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
          )}
          scrollEventThrottle={16}
        />
      )}
      <FloatingActionButton
        label="סקופ חדש"
        iconName="flash-outline"
        onPress={() => router.push({ pathname: "/post/create", params: { category: "scoops" } })}
      />
    </>
  );
}

export default withScreenWrapper(ScoopForumScreen);
