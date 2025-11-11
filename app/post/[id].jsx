import { useCallback, useMemo, useRef, useState } from "react";
import {
  Animated,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import AppHeader from "../../components/AppHeader";
import { withScreenWrapper } from "../components/layout/ScreenWrapper";
import { useForum } from "../../src/context/ForumContext";
import { useResponsiveValues } from "../../src/hooks/useResponsiveValues";
import { useAppearance } from "../../src/context/AppearanceContext";

function PostScreen() {
  const { id } = useLocalSearchParams();
  const { posts, comments: commentsMap, addComment } = useForum();
  const normalizedId = Array.isArray(id) ? id[0] : id;
  const post = useMemo(() => posts.find((item) => item.id === normalizedId), [normalizedId, posts]);
  const comments = useMemo(() => commentsMap[normalizedId] ?? [], [commentsMap, normalizedId]);
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
  const { colors, spacing, radius, rowHighlight, fontFamily } = useAppearance();
  const scrollY = useRef(new Animated.Value(0)).current;

  const [commentAuthor, setCommentAuthor] = useState("");
  const [commentText, setCommentText] = useState("");

  const handleSubmitComment = useCallback(() => {
    if (!normalizedId || commentText.trim().length === 0) {
      return;
    }

    addComment(normalizedId, {
      author: commentAuthor,
      text: commentText,
    });

    setCommentText("");
    setCommentAuthor("");
  }, [addComment, commentAuthor, commentText, normalizedId]);

  const commentHighlightStyles = useMemo(() => {
    switch (rowHighlight) {
      case "filled":
        return {
          container: {
            backgroundColor: colors.highlight,
            borderColor: colors.highlightBorder,
          },
        };
      case "none":
        return { container: {} };
      default:
        return {
          container: {
            borderRightWidth: 4,
            borderRightColor: colors.highlightBorder,
            paddingRight: spacing(1.5),
          },
        };
    }
  }, [colors.highlight, colors.highlightBorder, rowHighlight, spacing]);

  return (
    <>
      <AppHeader title={post?.title ?? "פוסט"} subtitle={`מאת ${post?.author ?? "משתמש"}`} scrollY={scrollY} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 32}
      >
        <Animated.ScrollView
          style={{ flex: 1, paddingHorizontal: containerPadding }}
          contentContainerStyle={{ paddingBottom: cardSpacing * 4 }}
          showsVerticalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
          )}
          scrollEventThrottle={16}
        >
          <View
            style={{
              backgroundColor: colors.surface,
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
                fontFamily,
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
              fontFamily,
            }}
          >
            תגובות
          </Text>
          {comments.length === 0 ? (
            <View
              style={{
                backgroundColor: colors.surface,
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
                  fontFamily,
                }}
              >
                היו הראשונים להגיב לדיון הזה.
              </Text>
            </View>
          ) : (
            comments.map((comment) => (
              <View
                key={comment.id}
                style={[
                  {
                    backgroundColor: colors.surface,
                    borderRadius: cardRadius,
                    padding: cardPadding,
                    marginBottom: cardSpacing,
                    borderWidth: 1,
                    borderColor: colors.divider,
                  },
                  commentHighlightStyles.container,
                ]}
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
                    fontFamily,
                  }}
                >
                  {comment.author}
                </Text>
                  <Text style={{ color: colors.textMuted, fontSize: smallFontSize, fontFamily }}>
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
                    fontFamily,
                  }}
                >
                  {comment.text}
                </Text>
              </View>
            ))
          )}
        </Animated.ScrollView>
        <View
          style={{
            paddingHorizontal: containerPadding,
            paddingBottom: cardSpacing * 1.5,
            backgroundColor: colors.background,
          }}
        >
          <View
            style={{
              backgroundColor: colors.surface,
              borderRadius: cardRadius,
              padding: cardPadding,
              borderWidth: 1,
              borderColor: colors.divider,
            }}
          >
            <Text
              style={{
                color: colors.text,
                fontSize: metaFontSize,
                marginBottom: spacing(1),
                textAlign: "right",
                fontWeight: "600",
                fontFamily,
              }}
            >
              השאירו תגובה
            </Text>
            <TextInput
              style={{
                backgroundColor: colors.background,
                color: colors.text,
                borderRadius: radius.md,
                paddingHorizontal: spacing(2),
                paddingVertical: spacing(1.5),
                fontSize: bodyFontSize,
                borderWidth: 1,
                borderColor: colors.divider,
                textAlign: "right",
                marginBottom: spacing(1),
                fontFamily,
              }}
              placeholder="שם (לא חובה)"
              placeholderTextColor="rgba(71,85,105,0.35)"
              value={commentAuthor}
              onChangeText={setCommentAuthor}
            />
            <TextInput
              style={{
                backgroundColor: colors.background,
                color: colors.text,
                borderRadius: radius.md,
                paddingHorizontal: spacing(2),
                paddingVertical: spacing(1.5),
                fontSize: bodyFontSize,
                borderWidth: 1,
                borderColor: colors.divider,
                textAlign: "right",
                minHeight: spacing(12),
                marginBottom: spacing(1.5),
                fontFamily,
              }}
              placeholder="מה יש לכם לומר?"
              placeholderTextColor="rgba(71,85,105,0.35)"
              value={commentText}
              onChangeText={setCommentText}
              multiline
            />
            <TouchableOpacity
              style={{
                backgroundColor: commentText.trim().length === 0 ? colors.subtleBackground : colors.brand,
                borderRadius: radius.lg,
                paddingVertical: buttonPaddingVertical,
                borderWidth: commentText.trim().length === 0 ? 1 : 0,
                borderColor: colors.divider,
              }}
              activeOpacity={0.9}
              onPress={handleSubmitComment}
              accessibilityRole="button"
              disabled={commentText.trim().length === 0}
            >
              <Text
                style={{
                  color: commentText.trim().length === 0 ? colors.textMuted : colors.surface,
                  textAlign: "center",
                  fontSize: buttonFontSize,
                  fontWeight: "700",
                  fontFamily,
                }}
              >
                שליחת תגובה
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </>
  );
}

export default withScreenWrapper(PostScreen);
