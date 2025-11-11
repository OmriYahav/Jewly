import { useCallback, useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAppearance } from "../../src/context/AppearanceContext";
import { useForum } from "../../src/context/ForumContext";
import SearchModal from "../../components/SearchModal";

export default function Header({ title, subtitle, onSearchPress }) {
  const navigation = useNavigation();
  const router = useRouter();
  const { colors, spacing, fonts, radius } = useAppearance();
  const { posts } = useForum();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const styles = StyleSheet.create({
    safeArea: {
      backgroundColor: colors.header,
      paddingHorizontal: spacing(2),
      paddingTop: spacing(2),
      paddingBottom: spacing(1.5),
    },
    headerRow: {
      flexDirection: "row-reverse",
      alignItems: "center",
      justifyContent: "space-between",
      gap: spacing(2),
    },
    titleBlock: {
      flex: 1,
      alignItems: "flex-end",
    },
    title: {
      color: colors.text,
      fontSize: fonts.title + 6,
      lineHeight: fonts.title + 12,
      fontWeight: "800",
      textAlign: "right",
    },
    subtitle: {
      marginTop: 4,
      color: colors.textMuted,
      fontSize: fonts.body,
      textAlign: "right",
    },
    iconButton: {
      width: spacing(5),
      height: spacing(5),
      borderRadius: radius.md,
      backgroundColor: colors.surface,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: colors.divider,
    },
    iconButtonPressed: {
      opacity: 0.85,
    },
    iconColor: {
      color: colors.brand,
    },
  });

  const IconButton = ({ name, onPress, accessibilityLabel }) => (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={({ pressed }) => [styles.iconButton, pressed && styles.iconButtonPressed]}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    >
      <MaterialCommunityIcons name={name} size={22} color={styles.iconColor.color} />
    </Pressable>
  );

  const handleOpenDrawer = useCallback(() => {
    if (navigation?.openDrawer) {
      navigation.openDrawer();
    }
  }, [navigation]);

  const handleSearch = useCallback(() => {
    setIsSearchOpen(true);
    if (typeof onSearchPress === "function") {
      onSearchPress();
    }
  }, [onSearchPress]);

  const handleCloseSearch = useCallback(() => {
    setIsSearchOpen(false);
  }, []);

  const handleSelectResult = useCallback(
    (postId) => {
      setIsSearchOpen(false);
      router.push({ pathname: "/post/[id]", params: { id: postId } });
    },
    [router]
  );

  return (
    <>
      <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
        <View style={styles.headerRow}>
          <IconButton name="menu" onPress={handleOpenDrawer} accessibilityLabel="פתיחת תפריט" />
          <View style={styles.titleBlock}>
            <Text
              style={styles.title}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.8}
            >
              {title}
            </Text>
            {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
          </View>
          <IconButton name="magnify" onPress={handleSearch} accessibilityLabel="חיפוש" />
        </View>
      </SafeAreaView>
      <SearchModal
        visible={isSearchOpen}
        onClose={handleCloseSearch}
        posts={posts}
        onSelectResult={handleSelectResult}
      />
    </>
  );
}
