import { useCallback, useMemo, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import Header from "../components/Header";
import ScreenContainer from "../components/layout/ScreenContainer";
import { useForum } from "../../src/context/ForumContext";
import { useResponsiveValues } from "../../src/hooks/useResponsiveValues";
import { colors, spacing, radius } from "../../src/theme";

export default function PostScreen() {
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

  return (
    <ScreenContainer>
      <Header title={post?.title ?? "פוסט"} subtitle={`מאת ${post?.author ?? "משתמש"}`} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 32}
      >
        <ScrollView
          style={{ flex: 1, paddingHorizontal: containerPadding }}
          contentContainerStyle={{ paddingBottom: cardSpacing * 4 }}
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
            paddingHorizontal: containerPadding,
            paddingBottom: cardSpacing * 1.5,
            backgroundColor: "rgba(14, 17, 22, 0.92)",
          }}
        >
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
                color: colors.text,
                fontSize: metaFontSize,
                marginBottom: spacing(1),
                textAlign: "right",
                fontWeight: "600",
              }}
            >
              השאירו תגובה
            </Text>
            <TextInput
              style={{
                backgroundColor: colors.bg,
                color: colors.text,
                borderRadius: radius.md,
                paddingHorizontal: spacing(2),
                paddingVertical: spacing(1.5),
                fontSize: bodyFontSize,
                borderWidth: 1,
                borderColor: colors.divider,
                textAlign: "right",
                marginBottom: spacing(1),
              }}
              placeholder="שם (לא חובה)"
              placeholderTextColor="rgba(232,238,242,0.45)"
              value={commentAuthor}
              onChangeText={setCommentAuthor}
            />
            <TextInput
              style={{
                backgroundColor: colors.bg,
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
              }}
              placeholder="מה יש לכם לומר?"
              placeholderTextColor="rgba(232,238,242,0.45)"
              value={commentText}
              onChangeText={setCommentText}
              multiline
            />
            <TouchableOpacity
              style={{
                backgroundColor: commentText.trim().length === 0 ? colors.divider : colors.brand,
                borderRadius: radius.lg,
                paddingVertical: buttonPaddingVertical,
              }}
              activeOpacity={0.9}
              onPress={handleSubmitComment}
              accessibilityRole="button"
              disabled={commentText.trim().length === 0}
            >
              <Text
                style={{
                  color: colors.bg,
                  textAlign: "center",
                  fontSize: buttonFontSize,
                  fontWeight: "700",
                }}
              >
                שליחת תגובה
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}
