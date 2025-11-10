import { SafeAreaView, ScrollView, View, Text, TouchableOpacity } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useLocalSearchParams } from "expo-router";
import Header from "../components/Header";
import { posts, comments as commentsMap } from "../../data/posts";
import { useResponsiveValues } from "../hooks/useResponsiveValues";

export default function PostScreen() {
  const { id } = useLocalSearchParams();
  const post = posts.find((item) => item.id === id);
  const comments = commentsMap[id] ?? [];
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

  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar style="light" />
      <Header title={post?.title ?? "פוסט"} subtitle={`מאת ${post?.author ?? "משתמש"}`} />
      <ScrollView
        className="flex-1"
        style={{ paddingHorizontal: containerPadding }}
        contentContainerStyle={{ paddingBottom: cardSpacing * 6 }}
      >
        <View
          className="bg-surface border border-border"
          style={{ borderRadius: cardRadius, padding: cardPadding, marginBottom: cardSpacing * 1.5 }}
        >
          <Text
            className="text-text text-right"
            style={{ fontSize: bodyFontSize, lineHeight: bodyFontSize * 1.6 }}
          >
            {post?.content ?? "הפוסט לא נמצא."}
          </Text>
        </View>
        <Text
          className="text-text font-semibold text-right"
          style={{ fontSize: titleFontSize, marginBottom: cardSpacing }}
        >
          תגובות
        </Text>
        {comments.length === 0 ? (
          <View
            className="bg-surface border border-border"
            style={{ borderRadius: cardRadius, padding: cardPadding }}
          >
            <Text
              className="text-text/70 text-right"
              style={{ fontSize: metaFontSize }}
            >
              היו הראשונים להגיב לדיון הזה.
            </Text>
          </View>
        ) : (
          comments.map((comment) => (
            <View
              key={comment.id}
              className="bg-surface border border-border"
              style={{
                borderRadius: cardRadius,
                padding: cardPadding,
                marginBottom: cardSpacing,
              }}
            >
              <View className="flex-row-reverse justify-between items-center mb-2">
                <Text
                  className="text-text font-medium text-right"
                  style={{ fontSize: metaFontSize }}
                >
                  {comment.author}
                </Text>
                <Text className="text-text/60" style={{ fontSize: smallFontSize }}>
                  {comment.time}
                </Text>
              </View>
              <Text
                className="text-text/80 text-right"
                style={{ fontSize: bodyFontSize - 1, lineHeight: (bodyFontSize - 1) * 1.5 }}
              >
                {comment.text}
              </Text>
            </View>
          ))
        )}
      </ScrollView>
      <View
        className="absolute bottom-0 left-0 right-0"
        style={{ paddingHorizontal: containerPadding, paddingBottom: cardSpacing * 1.5 }}
      >
        <TouchableOpacity
          className="bg-accent rounded-full"
          style={{ paddingVertical: buttonPaddingVertical }}
          activeOpacity={0.9}
        >
          <Text
            className="text-background text-center font-semibold"
            style={{ fontSize: buttonFontSize }}
          >
            הגב לפוסט
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
