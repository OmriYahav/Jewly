import { useCallback } from "react";
import { SafeAreaView, View, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useResponsiveValues } from "../hooks/useResponsiveValues";
import { COLORS } from "../constants/theme";

export default function Header({ title, subtitle }) {
  const navigation = useNavigation();
  const {
    containerPadding,
    headerTopPadding,
    headerBottomPadding,
    titleFontSize,
    subtitleFontSize,
    isTablet,
  } = useResponsiveValues();

  const handleOpenDrawer = useCallback(() => {
    if (navigation?.openDrawer) {
      navigation.openDrawer();
    }
  }, [navigation]);

  return (
    <SafeAreaView
      className="bg-background"
      style={{
        paddingHorizontal: containerPadding,
        paddingTop: headerTopPadding,
        paddingBottom: headerBottomPadding,
      }}
    >
      <View className="flex-row-reverse items-center justify-between">
        <View className="flex-1">
          <Text
            className="text-text font-bold text-right"
            style={{ fontSize: titleFontSize, lineHeight: titleFontSize * 1.2 }}
          >
            {title}
          </Text>
          {subtitle ? (
            <Text
              className="text-text/70 text-right mt-1"
              style={{ fontSize: subtitleFontSize }}
            >
              {subtitle}
            </Text>
          ) : null}
        </View>
        <TouchableOpacity
          className="bg-surface border border-border rounded-full"
          style={{ padding: isTablet ? 14 : 12 }}
          onPress={handleOpenDrawer}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          accessibilityLabel="פתיחת תפריט"
        >
          <Ionicons name="menu" size={20} color={COLORS.text} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
