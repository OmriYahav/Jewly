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
const BASE_HEADER_HEIGHT = Math.min(70, Math.max(60, WINDOW_HEIGHT * 0.1));
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
    () =>
      StyleSheet.create({
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
          height: totalHeight,
          paddingTop: insets.top,
          paddingHorizontal: spacing(2),
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
          height: BASE_HEADER_HEIGHT,
          flexDirection: I18nManager.isRTL ? "row" : "row-reverse",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: spacing(1.5),
        },
        titleBlock: {
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        },
        title: {
          color: titleColor,
          fontSize: fonts.title + 4,
          fontWeight: "700",
          textAlign: "center",
          letterSpacing: 0.3,
          fontFamily,
        },
        tagline: {
          color: taglineColor,
          fontSize: 12,
          fontWeight: "300",
          textAlign: "center",
          marginTop: 2,
          fontFamily,
        },
        subtitle: {
          color: taglineColor,
          fontSize: fonts.meta,
          fontWeight: "400",
          textAlign: "center",
          marginTop: 2,
          fontFamily,
        },
        iconButton: {
          width: 40,
          height: 40,
          borderRadius: 20,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: isDarkMode
            ? "rgba(255,255,255,0.08)"
            : "rgba(0,0,0,0.04)",
        },
        iconText: {
          color: iconColor,
        },
        placeholder: {
          height: totalHeight,
        },
      }),
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
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={navigation?.canGoBack?.() ? handleGoBack : handleToggleDrawer}
              accessibilityRole="button"
              accessibilityLabel={navigation?.canGoBack?.() ? "חזרה" : "תפריט"}
              style={styles.iconButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <MaterialCommunityIcons
                name={navigation?.canGoBack?.() ? (I18nManager.isRTL ? "arrow-right" : "arrow-left") : "menu"}
                size={24}
                color={iconColor}
                style={styles.iconText}
              />
            </TouchableOpacity>

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

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleOpenSearch}
              accessibilityRole="button"
              accessibilityLabel="חיפוש"
              style={styles.iconButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <MaterialCommunityIcons
                name="magnify"
                size={24}
                color={iconColor}
                style={styles.iconText}
              />
            </TouchableOpacity>
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
