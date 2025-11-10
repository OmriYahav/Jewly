import { useCallback, useMemo, useState } from "react";
import { ScrollView, View, Text, TouchableOpacity, Switch } from "react-native";
import Slider from "@react-native-community/slider";
import Header from "./components/Header";
import ScreenContainer from "./components/layout/ScreenContainer";
import { useResponsiveValues } from "./hooks/useResponsiveValues";

const accentColor = "#2A9DF4";
const themeOptions = [
  { name: "כחול", value: "#2A9DF4" },
  { name: "ירוק", value: "#2BC48A" },
  { name: "זהב", value: "#F4B942" },
];

export default function SettingsScreen() {
  const [selectedColor, setSelectedColor] = useState(themeOptions[0].value);
  const [fontSize, setFontSize] = useState(16);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [commentNotifications, setCommentNotifications] = useState(true);
  const {
    containerPadding,
    cardPadding,
    cardRadius,
    titleFontSize,
    bodyFontSize,
    metaFontSize,
    smallFontSize,
    buttonPaddingVertical,
    cardSpacing,
    isTablet,
  } = useResponsiveValues();

  const themedOptions = useMemo(
    () =>
      themeOptions.map((option) => ({
        ...option,
        isSelected: selectedColor === option.value,
      })),
    [selectedColor]
  );

  const createSelectColorHandler = useCallback(
    (value) => () => setSelectedColor(value),
    []
  );

  const handleToggleNotifications = useCallback(
    (value) => setNotificationsEnabled(value),
    []
  );

  const handleToggleComments = useCallback(
    (value) => setCommentNotifications(value),
    []
  );

  return (
    <ScreenContainer>
      <Header title="הגדרות" subtitle="התאמה אישית של החוויה" />
      <ScrollView
        className="flex-1"
        style={{ paddingHorizontal: containerPadding }}
        contentContainerStyle={{ paddingBottom: cardSpacing * 3 }}
      >
        <View
          className="bg-surface border border-border"
          style={{ borderRadius: cardRadius, padding: cardPadding, marginBottom: cardSpacing * 1.5 }}
        >
          <Text
            className="text-text font-semibold text-right"
            style={{ fontSize: titleFontSize, marginBottom: cardSpacing / 1.5 }}
          >
            ערכת נושא
          </Text>
          <View className="flex-row-reverse" style={{ gap: cardSpacing }}>
            {themedOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                onPress={createSelectColorHandler(option.value)}
                className={`flex-1 border rounded-2xl ${option.isSelected ? "border-accent" : "border-border"}`}
                style={{
                  backgroundColor: option.isSelected ? "rgba(42, 157, 244, 0.15)" : "transparent",
                  paddingVertical: buttonPaddingVertical - 2,
                  paddingHorizontal: isTablet ? 18 : 12,
                }}
                accessibilityRole="button"
              >
                <View className="flex-row-reverse items-center justify-between">
                  <Text className="text-text" style={{ fontSize: bodyFontSize }}>
                    {option.name}
                  </Text>
                  <View style={{ backgroundColor: option.value, width: 18, height: 18, borderRadius: 9 }} />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View
          className="bg-surface border border-border"
          style={{ borderRadius: cardRadius, padding: cardPadding, marginBottom: cardSpacing * 1.5 }}
        >
          <Text
            className="text-text font-semibold text-right"
            style={{ fontSize: titleFontSize, marginBottom: cardSpacing / 1.5 }}
          >
            גודל טקסט
          </Text>
          <Text
            className="text-text/70 text-right"
            style={{ fontSize: metaFontSize, marginBottom: cardSpacing / 2 }}
          >
            התאם את גודל הכתב בפיד ובתגובות
          </Text>
          <Slider
            value={fontSize}
            minimumValue={14}
            maximumValue={24}
            onValueChange={(value) => setFontSize(value)}
            minimumTrackTintColor={accentColor}
            maximumTrackTintColor="#2F3541"
            thumbTintColor={accentColor}
          />
          <Text
            className="text-text text-right"
            style={{ marginTop: cardSpacing / 2, fontSize: metaFontSize }}
          >
            {Math.round(fontSize)}pt
          </Text>
        </View>

        <View
          className="bg-surface border border-border"
          style={{ borderRadius: cardRadius, padding: cardPadding }}
        >
          <Text
            className="text-text font-semibold text-right"
            style={{ fontSize: titleFontSize, marginBottom: cardSpacing / 1.5 }}
          >
            התראות
          </Text>
          <View className="flex-row-reverse items-center justify-between" style={{ marginBottom: cardSpacing }}>
            <View className="flex-1 mr-4">
              <Text className="text-text text-right" style={{ fontSize: bodyFontSize }}>
                התראות כלליות
              </Text>
              <Text className="text-text/60 text-right mt-1" style={{ fontSize: smallFontSize }}>
                קבל עדכון על פוסטים חדשים בנושאים שבחרת
              </Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={handleToggleNotifications}
              thumbColor={notificationsEnabled ? accentColor : "#1F2531"}
              trackColor={{ false: "#2F3541", true: "rgba(42, 157, 244, 0.35)" }}
            />
          </View>
          <View className="flex-row-reverse items-center justify-between">
            <View className="flex-1 mr-4">
              <Text className="text-text text-right" style={{ fontSize: bodyFontSize }}>
                התראות תגובות
              </Text>
              <Text className="text-text/60 text-right mt-1" style={{ fontSize: smallFontSize }}>
                קבל הודעה כאשר מגיבים לדיונים שלך
              </Text>
            </View>
            <Switch
              value={commentNotifications}
              onValueChange={handleToggleComments}
              thumbColor={commentNotifications ? accentColor : "#1F2531"}
              trackColor={{ false: "#2F3541", true: "rgba(42, 157, 244, 0.35)" }}
            />
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
