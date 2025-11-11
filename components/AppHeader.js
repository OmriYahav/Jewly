import { memo, useCallback, useMemo, useRef, useState } from "react";
import {
  Animated,
  I18nManager,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useNavigation, useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAppearance } from "../src/context/AppearanceContext";
import { useForum } from "../src/context/ForumContext";
import SearchModal from "./SearchModal";

const BASE_HEADER_HEIGHT = 78;

export const APP_HEADER_HEIGHT = BASE_HEADER_HEIGHT;

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

const HeaderActionButton = memo(function HeaderActionButton({
  iconName,
  onPress,
  accessibilityLabel,
  buttonStyle,
  pressedStyle,
  wrapperStyle,
  iconColor,
}) {
  const animation = useRef(new Animated.Value(0)).current;

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
      speed: 24,
      bounciness: 6,
    }).start();
  }, [animation]);

  const handlePressOut = useCallback(() => {
    Animated.spring(animation, {
      toValue: 0,
      useNativeDriver: true,
      speed: 24,
      bounciness: 6,
    }).start();
  }, [animation]);

  return (
    <Animated.View style={[wrapperStyle, { transform: [{ scale }] }]}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        style={({ pressed }) => [buttonStyle, pressed && pressedStyle]}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
      >
        <MaterialCommunityIcons name={iconName} size={22} color={iconColor} />
      </Pressable>
    </Animated.View>
  );
});

const AppHeader = memo(function AppHeader({ title = "Jewly", subtitle, scrollY }) {
  const navigation = useNavigation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, fonts, spacing, shadow, fontFamily, isDarkMode } = useAppearance();
  const { posts } = useForum();
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const gradientColors = colors.headerGradient ?? [colors.header, colors.header];
  const totalHeight = BASE_HEADER_HEIGHT + insets.top;

  const headerOpacity = useMemo(() => {
    if (!scrollY) {
      return null;
    }
    return scrollY.interpolate({
      inputRange: [0, 120],
      outputRange: [1, 0.9],
      extrapolate: "clamp",
    });
  }, [scrollY]);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        wrapper: {
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          ...shadow.header,
        },
        gradient: {
          ...StyleSheet.absoluteFillObject,
          opacity: isDarkMode ? 0.98 : 1,
        },
        safeArea: {
          height: totalHeight,
          paddingTop: insets.top,
          paddingHorizontal: spacing(2),
          justifyContent: "center",
        },
        content: {
          flex: 1,
          flexDirection: I18nManager.isRTL ? "row" : "row-reverse",
          alignItems: "center",
          justifyContent: "space-between",
          columnGap: spacing(2),
        },
        titleBlock: {
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          gap: 4,
        },
        title: {
          color: colors.text,
          fontSize: fonts.title + 6,
          fontWeight: "700",
          textAlign: "center",
          letterSpacing: 0.2,
          fontFamily,
        },
        subtitle: {
          color: colors.textMuted,
          fontSize: fonts.meta + 1,
          textAlign: "center",
          fontFamily,
        },
        iconWrapper: {
          borderRadius: 14,
          ...shadow.card,
        },
        iconButton: {
          width: 44,
          height: 44,
          borderRadius: 14,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: colors.iconBackground,
        },
        iconButtonPressed: {
          opacity: 0.85,
        },
        placeholder: {
          height: totalHeight,
        },
      }),
    [colors.iconBackground, colors.text, colors.textMuted, fontFamily, fonts.meta, fonts.title, insets.top, isDarkMode, shadow.card, shadow.header, spacing, totalHeight]
  );

  const handleToggleDrawer = useCallback(() => {
    if (navigation?.openDrawer) {
      navigation.openDrawer();
    }
  }, [navigation]);

  const handleGoBack = useCallback(() => {
    if (navigation?.canGoBack?.()) {
      navigation.goBack();
    }
  }, [navigation]);

  const handleOpenSearch = useCallback(() => {
    setIsSearchVisible(true);
  }, []);

  const handleCloseSearch = useCallback(() => {
    setIsSearchVisible(false);
  }, []);

  const handleSelectSearchResult = useCallback(
    (postId) => {
      setIsSearchVisible(false);
      if (postId) {
        router.push({ pathname: "/post/[id]", params: { id: postId } });
      }
    },
    [router]
  );

  const leftIcon = navigation?.canGoBack?.() ? (I18nManager.isRTL ? "arrow-right" : "arrow-left") : "menu";
  const leftAction = navigation?.canGoBack?.() ? handleGoBack : handleToggleDrawer;

  return (
    <>
      <Animated.View
        pointerEvents="box-none"
        style={[styles.wrapper, headerOpacity ? { opacity: headerOpacity } : { opacity: 0.96 }]}
      >
        <AnimatedLinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        />
        <SafeAreaView edges={["top", "left", "right"]} style={styles.safeArea}>
          <View style={styles.content}>
            <HeaderActionButton
              iconName={leftIcon}
              onPress={leftAction}
              accessibilityLabel={navigation?.canGoBack?.() ? "חזרה" : "תפריט"}
              buttonStyle={styles.iconButton}
              pressedStyle={styles.iconButtonPressed}
              wrapperStyle={styles.iconWrapper}
              iconColor={colors.brand}
            />
            <View style={styles.titleBlock}>
              <Text
                style={styles.title}
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.85}
              >
                {title}
              </Text>
              {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
            </View>
            <HeaderActionButton
              iconName="magnify"
              onPress={handleOpenSearch}
              accessibilityLabel="חיפוש"
              buttonStyle={styles.iconButton}
              pressedStyle={styles.iconButtonPressed}
              wrapperStyle={styles.iconWrapper}
              iconColor={colors.brand}
            />
          </View>
        </SafeAreaView>
      </Animated.View>
      <View style={styles.placeholder} />
      <SearchModal
        visible={isSearchVisible}
        onClose={handleCloseSearch}
        posts={posts}
        onSelectResult={handleSelectSearchResult}
      />
    </>
  );
});

export default AppHeader;
