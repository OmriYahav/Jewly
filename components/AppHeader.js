import { memo, useCallback, useMemo, useState } from "react";
import {
  Animated,
  Dimensions,
  I18nManager,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation, useRouter } from "expo-router";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAppearance } from "../src/context/AppearanceContext";
import { useForum } from "../src/context/ForumContext";
import SearchModal from "./SearchModal";

const WINDOW_HEIGHT = Dimensions.get("window").height || 0;
const HEADER_COMPACT_RATIO = 0.25;
const ICON_SIZE = 24;
const ICON_BUTTON_SIZE = 32;
const ORIGINAL_BASE_HEADER_HEIGHT = Math.min(64, Math.max(48, WINDOW_HEIGHT * 0.08));
const BASE_HEADER_HEIGHT = Math.max(
  18,
  Math.round(ORIGINAL_BASE_HEADER_HEIGHT * HEADER_COMPACT_RATIO)
);
const SHRINK_DISTANCE = 120;

export const APP_HEADER_HEIGHT = BASE_HEADER_HEIGHT;

const AnimatedSafeAreaView = Animated.createAnimatedComponent(SafeAreaView);

const AppHeader = memo(function AppHeader({ title = "Jewly", subtitle, scrollY }) {
  const navigation = useNavigation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { fonts, spacing, fontFamily, isDarkMode } = useAppearance();
  const { posts } = useForum();
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const effectiveScrollY = useMemo(() => scrollY ?? new Animated.Value(0), [scrollY]);
  const clampedScroll = useMemo(
    () => Animated.diffClamp(effectiveScrollY, 0, SHRINK_DISTANCE),
    [effectiveScrollY]
  );
  const shrinkProgress = useMemo(
    () =>
      clampedScroll.interpolate({
        inputRange: [0, SHRINK_DISTANCE],
        outputRange: [0, 1],
        extrapolate: "clamp",
      }),
    [clampedScroll]
  );
  const headerScale = useMemo(
    () =>
      shrinkProgress.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 0.94],
      }),
    [shrinkProgress]
  );
  const headerOpacity = useMemo(
    () =>
      shrinkProgress.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 0.96],
      }),
    [shrinkProgress]
  );

  const totalHeight = BASE_HEADER_HEIGHT + insets.top;
  const headerPosition = Platform.OS === "web" ? "fixed" : "absolute";

  const titleColor = isDarkMode ? "rgba(255,255,255,0.9)" : "#1A1A1A";
  const taglineColor = isDarkMode ? "#aaa" : "#8c8c8c";
  const iconColor = isDarkMode ? "#fff" : "#1A1A1A";
  const surfaceColor = isDarkMode
    ? "rgba(0, 0, 0, 0.5)"
    : "rgba(255, 255, 255, 0.8)";

  const styles = useMemo(
    () => {
      const controlGroupWidth = ICON_BUTTON_SIZE * 2 + spacing(2.25);

      return StyleSheet.create({
        wrapper: {
          position: headerPosition,
          top: 0,
          left: 0,
          right: 0,
          width: "100%",
          zIndex: 50,
          shadowColor: "#000",
          shadowOpacity: isDarkMode ? 0.2 : 0.1,
          shadowOffset: { width: 0, height: 2 },
          shadowRadius: 4,
          elevation: 3,
        },
        safeArea: {
          minHeight: totalHeight,
          paddingHorizontal: spacing(2),
          paddingVertical: spacing(0.25),
          backgroundColor: surfaceColor,
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: isDarkMode
            ? "rgba(255,255,255,0.18)"
            : "rgba(26,26,26,0.08)",
          ...Platform.select({
            web: {
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
            },
            default: {},
          }),
        },
        headerContainer: {
          minHeight: BASE_HEADER_HEIGHT,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: spacing(0.5),
        },
        titleBlock: {
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        },
        title: {
          color: titleColor,
          fontSize: Math.max(14, fonts.title - 2),
          lineHeight: Math.max(16, fonts.title),
          fontWeight: "700",
          textAlign: "center",
          letterSpacing: 0.3,
          fontFamily,
        },
        tagline: {
          color: taglineColor,
          fontSize: 8,
          lineHeight: 10,
          fontWeight: "300",
          textAlign: "center",
          marginTop: 0,
          fontFamily,
        },
        subtitle: {
          color: taglineColor,
          fontSize: Math.max(10, fonts.meta - 1),
          lineHeight: Math.max(12, fonts.meta),
          fontWeight: "400",
          textAlign: "center",
          marginTop: 0,
          fontFamily,
        },
        iconButton: {
          width: ICON_BUTTON_SIZE,
          height: ICON_BUTTON_SIZE,
          borderRadius: ICON_BUTTON_SIZE / 2,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: isDarkMode
            ? "rgba(255,255,255,0.08)"
            : "rgba(0,0,0,0.04)",
        },
        leftControls: {
          width: controlGroupWidth,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-start",
        },
        rightControls: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-end",
          width: controlGroupWidth,
        },
        spacer: {
          width: ICON_BUTTON_SIZE,
          height: ICON_BUTTON_SIZE,
        },
        searchButton: {
          marginRight: spacing(0.75),
        },
        iconText: {
          color: iconColor,
        },
        placeholder: {
          minHeight: totalHeight,
        },
        controlFiller: {
          flex: 1,
        },
      });
    },
    [
      fontFamily,
      fonts.title,
      fonts.meta,
      headerPosition,
      insets.top,
      isDarkMode,
      spacing,
      surfaceColor,
      taglineColor,
      titleColor,
      totalHeight,
      iconColor,
    ]
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

  return (
    <>
      <Animated.View
        pointerEvents="box-none"
        style={[styles.wrapper, { opacity: headerOpacity }]}
      >
        <AnimatedSafeAreaView edges={["top", "left", "right"]} style={styles.safeArea}>
          <Animated.View style={[styles.headerContainer, { transform: [{ scale: headerScale }] }]}> 
            <View style={styles.leftControls}>
              {navigation?.canGoBack?.() ? (
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={handleGoBack}
                  accessibilityRole="button"
                  accessibilityLabel="חזרה"
                  style={styles.iconButton}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <MaterialCommunityIcons
                    name={I18nManager.isRTL ? "arrow-right" : "arrow-left"}
                    size={ICON_SIZE}
                    color={iconColor}
                    style={styles.iconText}
                  />
                </TouchableOpacity>
              ) : (
                <View style={styles.spacer} />
              )}
              <View style={styles.controlFiller} />
            </View>

            <View style={styles.titleBlock}>
              <Text
                style={styles.title}
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.85}
              >
                {title}
              </Text>
              <Text style={styles.tagline}>פורום חדשות ודיונים</Text>
              {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
            </View>

            <View style={styles.rightControls}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleOpenSearch}
                accessibilityRole="button"
                accessibilityLabel="חיפוש"
                style={[styles.iconButton, styles.searchButton]}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <MaterialCommunityIcons
                  name="magnify"
                  size={ICON_SIZE}
                  color={iconColor}
                  style={styles.iconText}
                />
              </TouchableOpacity>

              {navigation?.openDrawer ? (
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={handleToggleDrawer}
                  accessibilityRole="button"
                  accessibilityLabel="תפריט"
                  style={styles.iconButton}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <MaterialCommunityIcons
                    name="menu"
                    size={ICON_SIZE}
                    color={iconColor}
                    style={styles.iconText}
                  />
                </TouchableOpacity>
              ) : (
                <View style={styles.spacer} />
              )}
            </View>
          </Animated.View>

        </AnimatedSafeAreaView>
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
