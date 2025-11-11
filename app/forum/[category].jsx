import { useCallback, useMemo, useRef } from "react";
import { Animated, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import AppHeader from "../../components/AppHeader";
import PostCard from "../../components/PostCard";
import FloatingActionButton from "../../components/FloatingActionButton";
import { withScreenWrapper } from "../components/layout/ScreenWrapper";
import { useForum } from "../../src/context/ForumContext";
import { useAppearance } from "../../src/context/AppearanceContext";

function ForumCategoryScreen() {
  const { category } = useLocalSearchParams();
  const router = useRouter();
  const { posts, categories } = useForum();
  const { spacing, colors, fonts, fontFamily } = useAppearance();
  const scrollY = useRef(new Animated.Value(0)).current;
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
    ({ item, index }) => (
      <PostCard
        title={item.title}
        author={item.author}
        tagLabel={item.tag}
        views={item.views}
        comments={item.comments}
        index={index}
        onPress={() => router.push({ pathname: "/post/[id]", params: { id: item.id } })}
      />
    ),
    [router]
  );

  const keyExtractor = useCallback((item) => item.id, []);

  return (
    <>
      <AppHeader title={forum?.label ?? "פורום"} subtitle="הדיונים החמים ביותר" scrollY={scrollY} />
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
            <Text
              style={{
                color: colors.textMuted,
                fontSize: fonts.body,
                textAlign: "center",
                fontFamily,
              }}
            >
              אין פוסטים להצגה כרגע. היו הראשונים לפתוח דיון!
            </Text>
          </View>
        ) : (
          <Animated.FlatList
            data={filteredPosts}
            keyExtractor={keyExtractor}
            renderItem={renderThread}
            style={{ flex: 1 }}
            contentContainerStyle={listPadding}
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
      </View>
      <FloatingActionButton
        label="פוסט חדש"
        onPress={() => {
          if (forum) {
            router.push({ pathname: "/post/create", params: { category: forum.key } });
          } else {
            router.push("/post/create");
          }
        }}
      />
    </>
  );
}

export default withScreenWrapper(ForumCategoryScreen);
