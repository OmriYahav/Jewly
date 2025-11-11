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
const ICON_SIZE = 26;
const ICON_BUTTON_SIZE = 44;
const BASE_HEADER_HEIGHT = Math.min(60, Math.max(48, Math.round(WINDOW_HEIGHT * 0.08)));
const SHRINK_DISTANCE = 90;

export const APP_HEADER_HEIGHT = BASE_HEADER_HEIGHT;

const AnimatedSafeAreaView = Animated.createAnimatedComponent(SafeAreaView);

const AppHeader = memo(function AppHeader({ title = "Jewly", subtitle, scrollY }) {
  const navigation = useNavigation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, fonts, spacing, fontFamily, isDarkMode, shadow } = useAppearance();
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

  const titleColor = colors.text;
  const taglineColor = colors.textMuted;
  const iconColor = colors.text;
  const surfaceColor = colors.surfaceGlass;

  const styles = useMemo(
    () => {
      const controlGroupWidth = ICON_BUTTON_SIZE * 2 + spacing(1);

      return StyleSheet.create({
        wrapper: {
          position: headerPosition,
          top: 0,
          left: 0,
          right: 0,
          width: "100%",
          zIndex: 50,
          ...shadow.header,
        },
        safeArea: {
          minHeight: totalHeight,
          paddingHorizontal: spacing(2.5),
          paddingVertical: spacing(0.5),
          backgroundColor: surfaceColor,
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: colors.headerBorder,
          borderBottomLeftRadius: spacing(2.5),
          borderBottomRightRadius: spacing(2.5),
          ...Platform.select({
            web: {
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
            },
            ios: {
              backgroundColor: surfaceColor,
            },
            default: {
              backgroundColor: surfaceColor,
            },
          }),
        },
        headerContainer: {
          minHeight: BASE_HEADER_HEIGHT,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: spacing(0.75),
        },
        titleBlock: {
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        },
        title: {
          color: titleColor,
          fontSize: Math.max(16, fonts.title - 1),
          lineHeight: Math.max(16, (fonts.title - 1) * 1.5),
          fontWeight: "600",
          textAlign: "center",
          letterSpacing: 0.3,
          fontFamily,
        },
        tagline: {
          color: taglineColor,
          fontSize: Math.max(10, fonts.meta - 1),
          lineHeight: Math.max(12, (fonts.meta - 1) * 1.5),
          fontWeight: "400",
          textAlign: "center",
          marginTop: spacing(0.25),
          opacity: 0.7,
          fontFamily,
        },
        subtitle: {
          color: taglineColor,
          fontSize: Math.max(11, fonts.meta),
          lineHeight: Math.max(14, fonts.meta * 1.5),
          fontWeight: "400",
          textAlign: "center",
          marginTop: spacing(0.25),
          opacity: 0.7,
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
            : "rgba(76,141,255,0.08)",
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: isDarkMode
            ? "rgba(255,255,255,0.12)"
            : "rgba(76,141,255,0.18)",
        },
        leftControls: {
          width: controlGroupWidth,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-start",
          columnGap: spacing(1),
        },
        rightControls: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-end",
          width: controlGroupWidth,
          columnGap: spacing(1),
        },
        spacer: {
          width: ICON_BUTTON_SIZE,
          height: ICON_BUTTON_SIZE,
        },
        searchButton: {
          marginRight: 0,
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
      colors.headerBorder,
      colors.surfaceGlass,
      fontFamily,
      fonts.title,
      fonts.meta,
      headerPosition,
      insets.top,
      isDarkMode,
      spacing,
      taglineColor,
      titleColor,
      totalHeight,
      iconColor,
      shadow.header,
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
