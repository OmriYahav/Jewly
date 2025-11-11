import { memo, useCallback, useEffect, useMemo, useRef } from "react";
import { Animated, Easing, Pressable, StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAppearance } from "../src/context/AppearanceContext";

const PostCard = memo(function PostCard({
  title,
  author,
  tagLabel,
  views = 0,
  comments = 0,
  onPress,
  index = 0,
}) {
  const { colors, spacing, radius, fonts, fontFamily } = useAppearance();
  const mountAnimation = useRef(new Animated.Value(0)).current;
  const pressAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(mountAnimation, {
      toValue: 1,
      duration: 400,
      delay: Math.min(index * 90, 360),
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [index, mountAnimation]);

  const handlePressIn = useCallback(() => {
    Animated.spring(pressAnimation, {
      toValue: 1,
      useNativeDriver: true,
      speed: 24,
      bounciness: 4,
    }).start();
  }, [pressAnimation]);

  const handlePressOut = useCallback(() => {
    Animated.spring(pressAnimation, {
      toValue: 0,
      useNativeDriver: true,
      speed: 24,
      bounciness: 4,
    }).start();
  }, [pressAnimation]);

  const animatedStyles = useMemo(() => {
    const translateY = mountAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [24, 0],
    });
    const opacity = mountAnimation;
    const pressScale = pressAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0.97],
    });
    const pressTranslate = pressAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -6],
    });

    return {
      opacity,
      transform: [
        { translateY },
        { translateX: pressTranslate },
        { scale: pressScale },
      ],
    };
  }, [mountAnimation, pressAnimation]);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          marginBottom: spacing(2),
          borderRadius: radius.lg,
          backgroundColor: colors.card,
          borderWidth: 1,
          borderColor: colors.cardBorder ?? colors.divider,
          overflow: "hidden",
        },
        pressable: {
          paddingVertical: spacing(2),
          paddingHorizontal: spacing(2.5),
          flexDirection: "column",
          rowGap: spacing(1.5),
        },
        pressed: {
          opacity: 0.95,
        },
        badge: {
          alignSelf: "flex-start",
          backgroundColor: colors.badgeBackground,
          paddingVertical: spacing(0.5),
          paddingHorizontal: spacing(1.5),
          borderRadius: radius.md,
        },
        badgeText: {
          color: colors.badgeText,
          fontWeight: "700",
          fontSize: fonts.meta,
          fontFamily,
        },
        tag: {
          color: colors.textMuted,
          fontSize: fonts.meta,
          fontFamily,
          textAlign: "right",
        },
        title: {
          color: colors.text,
          fontSize: fonts.title + 1,
          fontWeight: "700",
          lineHeight: (fonts.title + 1) * 1.4,
          textAlign: "right",
          fontFamily,
        },
        author: {
          color: colors.link,
          fontSize: fonts.body,
          fontWeight: "700",
          textAlign: "right",
          fontFamily,
        },
        metaRow: {
          flexDirection: "row-reverse",
          alignItems: "center",
          justifyContent: "flex-start",
          columnGap: spacing(3),
        },
        metaItem: {
          flexDirection: "row-reverse",
          alignItems: "center",
          columnGap: spacing(0.75),
        },
        metaText: {
          color: colors.textMuted,
          fontSize: fonts.meta,
          fontFamily,
        },
      }),
    [colors.badgeBackground, colors.badgeText, colors.card, colors.cardBorder, colors.link, colors.text, colors.textMuted, fonts.body, fonts.meta, fonts.title, fontFamily, radius.lg, radius.md, spacing]
  );

  const showSpecialBadge = tagLabel?.trim?.() === "דיווח מיוחד";

  return (
    <Animated.View style={[styles.container, animatedStyles]}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={({ pressed }) => [styles.pressable, pressed && styles.pressed]}
        accessibilityRole="button"
      >
        {showSpecialBadge ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>דיווח מיוחד</Text>
          </View>
        ) : null}
        {tagLabel && !showSpecialBadge ? <Text style={styles.tag}>{tagLabel}</Text> : null}
        <Text style={styles.title} numberOfLines={3}>
          {title}
        </Text>
        {author ? <Text style={styles.author}>{author}</Text> : null}
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <MaterialCommunityIcons name="eye-outline" size={18} color={colors.link} />
            <Text style={styles.metaText}>{Number(views).toLocaleString("he-IL")}</Text>
          </View>
          <View style={styles.metaItem}>
            <MaterialCommunityIcons name="message-text-outline" size={18} color={colors.success} />
            <Text style={styles.metaText}>{Number(comments).toLocaleString("he-IL")}</Text>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
});

export default PostCard;
