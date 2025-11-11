import { memo, useCallback, useMemo, useRef } from "react";
import { Animated, Pressable, StyleSheet, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppearance } from "../src/context/AppearanceContext";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const FloatingActionButton = memo(function FloatingActionButton({
  label = "כתיבה חדשה",
  iconName = "pencil-outline",
  onPress,
  bottomOffset = 0,
}) {
  const { colors, spacing, shadow, fontFamily, fonts } = useAppearance();
  const insets = useSafeAreaInsets();
  const animation = useRef(new Animated.Value(0)).current;
  const gradientColors = colors.fabGradient ?? [colors.brand, colors.brand];

  const scale = useMemo(
    () =>
      animation.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 0.94],
      }),
    [animation]
  );

  const handlePressIn = useCallback(() => {
    Animated.spring(animation, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
      bounciness: 5,
    }).start();
  }, [animation]);

  const handlePressOut = useCallback(() => {
    Animated.spring(animation, {
      toValue: 0,
      useNativeDriver: true,
      speed: 20,
      bounciness: 5,
    }).start();
  }, [animation]);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          position: "absolute",
          right: spacing(3),
          bottom: Math.max(spacing(3), insets.bottom + spacing(1.5)) + bottomOffset,
          borderRadius: 36,
          overflow: "visible",
          ...shadow.floating,
        },
        pressable: {
          borderRadius: 36,
          overflow: "hidden",
        },
        gradient: {
          paddingHorizontal: spacing(2.5),
          paddingVertical: spacing(1.25),
          borderRadius: 36,
          flexDirection: "row-reverse",
          alignItems: "center",
          justifyContent: "center",
          columnGap: spacing(1.5),
        },
        label: {
          color: "#FFFFFF",
          fontWeight: "700",
          fontSize: fonts.body,
          fontFamily,
        },
      }),
    [bottomOffset, fontFamily, fonts.body, insets.bottom, shadow.floating, spacing]
  );

  return (
    <Animated.View style={[styles.container, { transform: [{ scale }] }]}>
      <AnimatedPressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.pressable}
        accessibilityRole="button"
        accessibilityLabel={label}
      >
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          <MaterialCommunityIcons name={iconName} size={20} color="#FFFFFF" />
          <Text style={styles.label}>{label}</Text>
        </LinearGradient>
      </AnimatedPressable>
    </Animated.View>
  );
});

export default FloatingActionButton;
