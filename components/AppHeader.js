import { memo, useCallback, useMemo, useState } from "react";
import {
  Animated,
  I18nManager,
  Platform,
  ScrollView,
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

const BASE_HEADER_HEIGHT = 48;
const NAV_BAR_HEIGHT = 36;
const SHRINK_DISTANCE = 120;
const NAV_CATEGORIES = ["ראשי", "סקופים", "פאנל", "דיונים חמים", "פורומים"];

export const APP_HEADER_HEIGHT = BASE_HEADER_HEIGHT + NAV_BAR_HEIGHT;

const AnimatedSafeAreaView = Animated.createAnimatedComponent(SafeAreaView);

const AppHeader = memo(function AppHeader({ title = "Jewly", subtitle, scrollY }) {
  const navigation = useNavigation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, fonts, spacing, fontFamily, isDarkMode } = useAppearance();
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

  const totalHeight = BASE_HEADER_HEIGHT + NAV_BAR_HEIGHT + insets.top;
  const headerPosition = Platform.OS === "web" ? "sticky" : "relative";

  const titleColor = isDarkMode ? "rgba(255,255,255,0.9)" : "#1A1A1A";
  const taglineColor = isDarkMode ? "#aaa" : "#8c8c8c";
  const iconColor = isDarkMode ? "#fff" : "#1A1A1A";
  const surfaceColor = isDarkMode ? "rgba(0,0,0,0.9)" : "#fff";

  const styles = useMemo(
    () =>
      StyleSheet.create({
        wrapper: {
          position: headerPosition,
          top: headerPosition === "sticky" ? 0 : undefined,
          left: 0,
          right: 0,
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
        },
        iconText: {
          color: iconColor,
        },
        navBar: {
          minHeight: NAV_BAR_HEIGHT,
          marginTop: spacing(0.5),
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: isDarkMode ? "rgba(255,255,255,0.08)" : "#EAEAEA",
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: isDarkMode ? "rgba(255,255,255,0.12)" : "#E5E5E5",
          justifyContent: "center",
          backgroundColor: surfaceColor,
        },
        navScroll: {
          flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
          alignItems: "center",
          paddingHorizontal: spacing(1),
        },
        navItem: {
          paddingVertical: 6,
          paddingHorizontal: spacing(1.2),
          borderRadius: 999,
          marginHorizontal: spacing(0.5),
          flexShrink: 0,
        },
        navItemText: {
          fontSize: fonts.meta + 1,
          fontFamily,
          color: isDarkMode ? "rgba(255,255,255,0.75)" : "#1F2933",
        },
        navItemActive: {
          backgroundColor: isDarkMode ? "rgba(77,163,255,0.18)" : "rgba(30,119,195,0.1)",
        },
        navItemActiveText: {
          color: colors.brand,
          fontWeight: "600",
        },
        placeholder: {
          height: totalHeight,
        },
      }),
    [
      colors.brand,
      fontFamily,
      fonts.meta,
      fonts.title,
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

          <View style={styles.navBar}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.navScroll}
            >
              {NAV_CATEGORIES.map((category, index) => (
                <TouchableOpacity
                  key={category}
                  activeOpacity={0.8}
                  style={[styles.navItem, index === 0 && styles.navItemActive]}
                  onPress={() => {
                    if (index === 0) {
                      router.replace("/");
                    }
                  }}
                >
                  <Text
                    style={[
                      styles.navItemText,
                      index === 0 && styles.navItemActiveText,
                    ]}
                  >
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </AnimatedSafeAreaView>
      </Animated.View>
      {headerPosition === "absolute" ? <View style={styles.placeholder} /> : null}
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
