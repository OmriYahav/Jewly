import { View, Text, TouchableOpacity } from "react-native";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useResponsiveValues } from "../hooks/useResponsiveValues";

export default function PostCard({ post }) {
  const {
    cardPadding,
    cardRadius,
    titleFontSize,
    metaFontSize,
    smallFontSize,
    cardSpacing,
  } = useResponsiveValues();

  return (
    <Link
      href={{ pathname: "/post/[id]", params: { id: post.id } }}
      asChild
    >
      <TouchableOpacity
        className="bg-surface border border-border"
        style={{
          borderRadius: cardRadius,
          padding: cardPadding,
          marginBottom: cardSpacing,
        }}
        activeOpacity={0.8}
      >
        <View
          className="flex-row-reverse justify-between items-center"
          style={{ marginBottom: cardSpacing / 2 }}
        >
          <Text
            className="text-text font-semibold text-right flex-1"
            style={{ fontSize: titleFontSize, lineHeight: titleFontSize * 1.2 }}
          >
            {post.title}
          </Text>
        </View>
        <View
          className="flex-row-reverse items-center justify-between"
          style={{ marginBottom: cardSpacing / 1.8 }}
        >
          <Text
            className="text-text/80 text-right"
            style={{ fontSize: metaFontSize }}
          >
            מאת {post.author} · {post.time}
          </Text>
        </View>
        <View
          className="flex-row-reverse items-center justify-start"
          style={{ gap: cardSpacing / 1.6 }}
        >
          <View className="flex-row-reverse items-center" style={{ gap: 4 }}>
            <Ionicons name="eye-outline" size={16} color="#2A9DF4" />
            <Text
              className="text-text/70"
              style={{ fontSize: smallFontSize }}
            >
              {post.views.toLocaleString()}
            </Text>
          </View>
          <View className="flex-row-reverse items-center" style={{ gap: 4 }}>
            <Ionicons name="chatbubble-ellipses-outline" size={16} color="#2A9DF4" />
            <Text
              className="text-text/70"
              style={{ fontSize: smallFontSize }}
            >
              {post.comments}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Link>
  );
}
