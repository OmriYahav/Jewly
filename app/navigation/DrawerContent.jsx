import { memo, useCallback, useMemo } from "react";
import { Platform, Text, View } from "react-native";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";

import { forumCategories } from "../../data/posts";
import { COLORS } from "../constants/theme";

const STATIC_LINKS = [
  { key: "settings", label: "הגדרות", icon: "settings-outline", route: "settings" },
  { key: "blocked", label: "רשימת החסומים", icon: "ban-outline", route: null },
  { key: "contact", label: "יצירת קשר", icon: "mail-outline", route: null },
];

const DrawerSectionTitle = memo(function DrawerSectionTitle({ title }) {
  return (
    <Text
      className="text-right text-xs text-text uppercase tracking-widest mt-6 mb-3"
      style={{ opacity: 0.7 }}
    >
      {title}
    </Text>
  );
});

const DrawerLink = memo(function DrawerLink({ icon, label, onPress, disabled = false }) {
  return (
    <DrawerItem
      label={() => (
        <View className="flex-row-reverse items-center justify-between">
          <Text className="text-text text-base" style={{ flex: 1, textAlign: "right" }}>
            {label}
          </Text>
          <Ionicons name={icon} size={20} color={COLORS.accent} />
        </View>
      )}
      style={{
        marginHorizontal: 0,
        borderRadius: 16,
        marginBottom: 8,
        backgroundColor: COLORS.surface,
        borderWidth: 1,
        borderColor: COLORS.border,
        opacity: disabled ? 0.6 : 1,
      }}
      onPress={disabled ? undefined : onPress}
      accessibilityState={{ disabled }}
    />
  );
});

const DrawerContent = memo(function DrawerContent({ navigation, ...rest }) {
  const handleNavigate = useCallback(
    (target, params) => () => {
      if (target) {
        navigation.navigate(target, params);
      }
    },
    [navigation]
  );

  const forumItems = useMemo(
    () =>
      forumCategories.map((category) => ({
        key: category.key,
        label: category.label,
        onPress: handleNavigate("forum/[category]", {
          category: category.key,
          title: category.label,
        }),
      })),
    [handleNavigate]
  );

  const otherLinks = useMemo(
    () =>
      STATIC_LINKS.map((link) => ({
        ...link,
        onPress: link.route ? handleNavigate(link.route) : undefined,
        disabled: !link.route,
      })),
    [handleNavigate]
  );

  return (
    <DrawerContentScrollView
      {...rest}
      contentContainerStyle={{
        flexGrow: 1,
        backgroundColor: COLORS.background,
        paddingHorizontal: 16,
        paddingTop: Platform.OS === "android" ? 48 : 24,
      }}
    >
      <View className="flex-col" style={{ gap: 4 }}>
        <DrawerSectionTitle title="פורומים" />
        {forumItems.map((item) => (
          <DrawerLink key={item.key} icon="chatbubble-outline" label={item.label} onPress={item.onPress} />
        ))}
        <DrawerSectionTitle title="פרטי חשבון" />
        <DrawerLink
          icon="log-in-outline"
          label="התחברות"
          onPress={handleNavigate("login")}
        />
        <DrawerSectionTitle title="שונות" />
        {otherLinks.map((item) => (
          <DrawerLink
            key={item.key}
            icon={item.icon}
            label={item.label}
            onPress={item.onPress}
            disabled={item.disabled}
          />
        ))}
      </View>
    </DrawerContentScrollView>
  );
});

export default DrawerContent;
