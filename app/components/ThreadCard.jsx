import React, { memo } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAppearance } from "../../src/context/AppearanceContext";

const ThreadCard = memo(({ title, author, tagLabel, views, comments, onPress }) => {
  const { colors, radius, spacing, fonts, shadow } = useAppearance();
  const styles = StyleSheet.create({
    card: {
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      padding: spacing(2),
      marginBottom: spacing(2),
      direction: "rtl",
      borderWidth: 1,
      borderColor: colors.divider,
      ...shadow.card,
    },
    pressed: {
      opacity: 0.92,
    },
    tag: {
      color: colors.danger,
      fontSize: fonts.body,
      marginBottom: spacing(1),
      fontWeight: "700",
      textAlign: "right",
    },
    title: {
      color: colors.text,
      fontSize: fonts.title + 4,
      lineHeight: (fonts.title + 4) * 1.25,
      fontWeight: "700",
      marginBottom: spacing(1),
      textAlign: "right",
    },
    author: {
      color: colors.brand,
      fontSize: fonts.body,
      fontWeight: "600",
      marginBottom: spacing(1),
      textAlign: "right",
    },
    metaRow: {
      flexDirection: "row-reverse",
      alignItems: "center",
      columnGap: spacing(3),
      gap: spacing(3),
      marginTop: spacing(1),
    },
    metaItem: {
      flexDirection: "row-reverse",
      alignItems: "center",
      columnGap: 6,
      gap: 6,
    },
    metaText: {
      color: colors.textMuted,
      fontSize: fonts.meta,
    },
    metaComments: {
      color: colors.success,
    },
  });

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      {tagLabel ? <Text style={styles.tag}>{tagLabel}</Text> : null}
      <Text numberOfLines={2} style={styles.title}>
        {title}
      </Text>
      {author ? <Text style={styles.author}>{author}</Text> : null}
      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <MaterialCommunityIcons name="eye-outline" size={16} color={colors.brand} />
          <Text style={styles.metaText}>{views.toLocaleString("he-IL")}</Text>
        </View>
        <View style={styles.metaItem}>
          <MaterialCommunityIcons name="message-text-outline" size={16} color={colors.success} />
          <Text style={[styles.metaText, styles.metaComments]}>{comments.toLocaleString("he-IL")}</Text>
        </View>
      </View>
    </Pressable>
  );
});

export default ThreadCard;
