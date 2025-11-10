import { useCallback, useMemo } from "react";
import { ScrollView, View, Text, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import Header from "../components/Header";
import ScreenContainer from "../components/layout/ScreenContainer";
import { posts, comments as commentsMap } from "../../data/posts";
import { useResponsiveValues } from "../../src/hooks/useResponsiveValues";
import { colors, spacing, radius } from "../../src/theme";

export default function PostScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const normalizedId = Array.isArray(id) ? id[0] : id;
  const post = useMemo(() => posts.find((item) => item.id === normalizedId), [normalizedId]);
  const comments = useMemo(() => commentsMap[normalizedId] ?? [], [normalizedId]);
  const {
    containerPadding,
    cardPadding,
    cardRadius,
    bodyFontSize,
    titleFontSize,
    metaFontSize,
    buttonPaddingVertical,
    buttonFontSize,
    cardSpacing,
    smallFontSize,
  } = useResponsiveValues();

  const handleReplyPress = useCallback(() => {
    router.push("/login");
  }, [router]);

  return (
    <ScreenContainer>
      <Header title={post?.title ?? "פוסט"} subtitle={`מאת ${post?.author ?? "משתמש"}`} />
      <ScrollView
        style={{ flex: 1, paddingHorizontal: containerPadding }}
        contentContainerStyle={{ paddingBottom: cardSpacing * 6 }}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            backgroundColor: colors.card,
            borderRadius: cardRadius,
            padding: cardPadding,
            marginBottom: cardSpacing * 1.5,
            borderWidth: 1,
            borderColor: colors.divider,
          }}
        >
          <Text
            style={{
              color: colors.text,
              fontSize: bodyFontSize,
              lineHeight: bodyFontSize * 1.6,
              textAlign: "right",
            }}
          >
            {post?.content ?? "הפוסט לא נמצא."}
          </Text>
        </View>
        <Text
          style={{
            color: colors.text,
            fontSize: titleFontSize,
            fontWeight: "700",
            marginBottom: cardSpacing,
            textAlign: "right",
          }}
        >
          תגובות
        </Text>
        {comments.length === 0 ? (
          <View
            style={{
              backgroundColor: colors.card,
              borderRadius: cardRadius,
              padding: cardPadding,
              borderWidth: 1,
              borderColor: colors.divider,
            }}
          >
            <Text
              style={{
                color: colors.textMuted,
                fontSize: metaFontSize,
                textAlign: "right",
              }}
            >
              היו הראשונים להגיב לדיון הזה.
            </Text>
          </View>
        ) : (
          comments.map((comment) => (
            <View
              key={comment.id}
              style={{
                backgroundColor: colors.card,
                borderRadius: cardRadius,
                padding: cardPadding,
                marginBottom: cardSpacing,
                borderWidth: 1,
                borderColor: colors.divider,
              }}
            >
              <View
                style={{
                  flexDirection: "row-reverse",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: spacing(0.5),
                }}
              >
                <Text
                  style={{
                    color: colors.text,
                    fontSize: metaFontSize,
                    fontWeight: "600",
                  }}
                >
                  {comment.author}
                </Text>
                <Text style={{ color: colors.textMuted, fontSize: smallFontSize }}>
                  {comment.time}
                </Text>
              </View>
              <Text
                style={{
                  color: colors.text,
                  opacity: 0.85,
                  fontSize: bodyFontSize - 1,
                  lineHeight: (bodyFontSize - 1) * 1.5,
                  textAlign: "right",
                }}
              >
                {comment.text}
              </Text>
            </View>
          ))
        )}
      </ScrollView>
      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          paddingHorizontal: containerPadding,
          paddingBottom: cardSpacing * 1.5,
        }}
        pointerEvents="box-none"
      >
        <TouchableOpacity
          style={{
            backgroundColor: colors.brand,
            borderRadius: radius.lg,
            paddingVertical: buttonPaddingVertical,
          }}
          activeOpacity={0.9}
          onPress={handleReplyPress}
          accessibilityRole="button"
        >
          <Text
            style={{
              color: colors.bg,
              textAlign: "center",
              fontSize: buttonFontSize,
              fontWeight: "700",
            }}
          >
            הגב לפוסט
          </Text>
        </TouchableOpacity>
      </View>
    </ScreenContainer>
  );
}
