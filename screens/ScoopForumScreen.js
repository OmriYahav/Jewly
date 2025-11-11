import { useCallback, useMemo } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import Header from "../app/components/Header";
import ThreadCard from "../app/components/ThreadCard";
import ScreenContainer from "../app/components/layout/ScreenContainer";
import { useForum } from "../src/context/ForumContext";
import { useAppearance } from "../src/context/AppearanceContext";

export default function ScoopForumScreen() {
  const router = useRouter();
  const { posts } = useForum();
  const { colors, spacing, radius, fonts } = useAppearance();

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
      <Header title="סקופים" subtitle="כל הדיווחים החמים בזמן אמת" />
      {scoopPosts.length === 0 ? (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: spacing(3),
          }}
        >
          <Text style={{ color: colors.textMuted, fontSize: fonts.body, textAlign: "center" }}>
            אין עדיין סקופים.
          </Text>
        </View>
      ) : (
        <FlatList
          data={scoopPosts}
          keyExtractor={keyExtractor}
          renderItem={renderThread}
          style={{ flex: 1 }}
          contentContainerStyle={contentPadding}
          initialNumToRender={6}
          windowSize={4}
          removeClippedSubviews
          showsVerticalScrollIndicator={false}
        />
      )}
      <TouchableOpacity
        onPress={() => router.push({ pathname: "/post/create", params: { category: "scoops" } })}
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
        accessibilityLabel="יצירת סקופ חדש"
        activeOpacity={0.9}
      >
        <Text
          style={{
            color: colors.surface,
            fontWeight: "700",
            fontSize: fonts.body,
          }}
        >
          סקופ חדש
        </Text>
      </TouchableOpacity>
    </ScreenContainer>
  );
}
