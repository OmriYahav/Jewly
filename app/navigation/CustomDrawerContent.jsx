import { useCallback, useMemo } from "react";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons, MaterialIcons, Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useAppearance } from "../../src/context/AppearanceContext";

const ICON_LIBRARIES = {
  material: MaterialIcons,
  ion: Ionicons,
  community: MaterialCommunityIcons,
};

export default function CustomDrawerContent(props) {
  const { navigation } = props;
  const appearance = useAppearance();
  const { colors, spacing, radius, fonts, shadow } = appearance;

  const styles = useMemo(
    () =>
      StyleSheet.create({
        root: {
          flex: 1,
          backgroundColor: colors.drawerBackground,
          paddingHorizontal: spacing(2.5),
          paddingVertical: spacing(3),
        },
        panel: {
          borderRadius: radius.lg,
          overflow: "hidden",
          ...shadow.card,
        },
        panelOverlay: {
          ...StyleSheet.absoluteFillObject,
          backgroundColor: colors.drawerOverlay,
        },
        panelContent: {
          borderRadius: radius.lg,
          backgroundColor: colors.surfaceElevated ?? colors.surface,
          paddingVertical: spacing(3),
          paddingHorizontal: spacing(2.5),
          gap: spacing(2.5),
        },
        header: {
          alignItems: "flex-end",
          gap: spacing(0.5),
        },
        headline: {
          color: colors.text,
          fontSize: fonts.title + 6,
          fontWeight: "600",
          textAlign: "right",
          fontFamily: appearance.fontFamily,
          letterSpacing: 0.4,
        },
        subheadline: {
          color: colors.textMuted,
          fontSize: fonts.body,
          textAlign: "right",
          opacity: 0.72,
          fontFamily: appearance.fontFamily,
        },
        section: {
          gap: spacing(1.25),
        },
        sectionTitle: {
          color: colors.textMuted,
          fontSize: fonts.body,
          textAlign: "right",
          opacity: 0.72,
          fontFamily: appearance.fontFamily,
          letterSpacing: 0.2,
        },
        itemButton: {
          borderRadius: radius.md,
          paddingVertical: spacing(1.5),
          paddingHorizontal: spacing(2),
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: colors.cardBorder ?? colors.divider,
          flexDirection: "row-reverse",
          alignItems: "center",
          justifyContent: "space-between",
          gap: spacing(1.5),
          minHeight: 52,
          ...shadow.card,
        },
        itemPressed: {
          backgroundColor: colors.highlight,
          borderColor: colors.highlightBorder,
        },
        itemLabel: {
          color: colors.text,
          fontSize: fonts.body,
          fontWeight: "500",
          fontFamily: appearance.fontFamily,
        },
        itemIconWrapper: {
          width: spacing(4),
          height: spacing(4),
          borderRadius: spacing(2),
          backgroundColor: colors.iconBackground,
          alignItems: "center",
          justifyContent: "center",
        },
        divider: {
          height: StyleSheet.hairlineWidth,
          backgroundColor: colors.cardBorder ?? colors.divider,
          opacity: 0.4,
        },
      }),
    [appearance.fontFamily, colors, fonts.body, fonts.title, radius.lg, radius.md, shadow.card, spacing]
  );

  const handleNavigate = useCallback(
    (target, params) => () => {
      if (target) {
        navigation.navigate(target, params);
      }
      navigation.closeDrawer();
    },
    [navigation]
  );

  const navigateToCategory = useCallback(
    (category, title) => handleNavigate("forum/[category]", { category, title }),
    [handleNavigate]
  );

  const renderItem = useCallback(
    ({ icon, label, onPress, iconLibrary = "material" }) => {
      const IconComponent = ICON_LIBRARIES[iconLibrary] ?? MaterialIcons;
      return (
        <Pressable
          key={label}
          onPress={onPress}
          style={({ pressed }) => [styles.itemButton, pressed && styles.itemPressed]}
          accessibilityRole="button"
        >
          <View style={styles.itemIconWrapper}>
            <IconComponent name={icon} size={22} color={colors.accent ?? colors.brand} />
          </View>
          <Text style={styles.itemLabel}>{label}</Text>
        </Pressable>
      );
    },
    [colors.accent, colors.brand, styles.itemButton, styles.itemIconWrapper, styles.itemLabel, styles.itemPressed]
  );

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={styles.root}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.panel}>
        <LinearGradient
          colors={[colors.subtleBackground, "transparent"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFillObject}
        />
        <View style={styles.panelOverlay} pointerEvents="none" />
        <View style={styles.panelContent}>
          <View style={styles.header}>
            <Text style={styles.headline}>Jewly</Text>
            <Text style={styles.subheadline}>פורום חדשות ודיונים</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>פורומים</Text>
            {[
              { icon: "add-circle-outline", label: "פוסט חדש", onPress: handleNavigate("post/create") },
              {
                icon: "forum",
                label: "יש לי מה לומר",
                onPress: navigateToCategory("opinion", "יש לי מה לומר"),
              },
              {
                icon: "description",
                label: "גילוי מסמכים",
                onPress: navigateToCategory("documents", "גילוי מסמכים"),
              },
              {
                icon: "gavel",
                label: "משפטים",
                onPress: navigateToCategory("law", "משפטים"),
              },
              {
                icon: "megaphone-outline",
                iconLibrary: "ion",
                label: "סקופים",
                onPress: handleNavigate("scoop-forum"),
              },
            ].map(renderItem)}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>פרטי חשבון</Text>
            {[
              { icon: "login", iconLibrary: "community", label: "התחברות", onPress: handleNavigate("login") },
            ].map(renderItem)}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>שונות</Text>
            {[
              { icon: "tune", label: "הגדרות", onPress: handleNavigate("settings") },
              {
                icon: "block",
                label: "רשימת החסומים",
                onPress: handleNavigate(),
              },
              {
                icon: "contact-support",
                label: "יצירת קשר",
                onPress: handleNavigate(),
              },
            ].map(renderItem)}
          </View>
        </View>
      </View>
    </DrawerContentScrollView>
  );
}
