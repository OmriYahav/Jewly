import { useCallback, useMemo, useState } from "react";
import { ScrollView, View, Text, TouchableOpacity, Switch } from "react-native";
import Slider from "@react-native-community/slider";
import Header from "./components/Header";
import ScreenContainer from "./components/layout/ScreenContainer";
import { useResponsiveValues } from "./hooks/useResponsiveValues";
import { colors, spacing, radius } from "../src/theme";

const themeOptions = [
  { name: "כחול", value: colors.brand },
  { name: "ירוק", value: colors.success },
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
        style={{ flex: 1, paddingHorizontal: containerPadding }}
        contentContainerStyle={{ paddingBottom: cardSpacing * 3 }}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            backgroundColor: colors.card,
            borderRadius: cardRadius,
            padding: cardPadding,
            marginBottom: cardSpacing * 1.5,
            borderWidth: 1,
            borderColor: colors.divider,
          }}
        >
          <Text
            style={{
              color: colors.text,
              fontSize: titleFontSize,
              marginBottom: cardSpacing / 1.5,
              textAlign: "right",
              fontWeight: "700",
            }}
          >
            ערכת נושא
          </Text>
          <View style={{ flexDirection: "row-reverse", gap: cardSpacing }}>
            {themedOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                onPress={createSelectColorHandler(option.value)}
                style={{
                  flex: 1,
                  borderRadius: radius.md + 6,
                  borderWidth: 1,
                  borderColor: option.isSelected ? colors.brand : colors.divider,
                  backgroundColor: option.isSelected ? "rgba(46, 124, 246, 0.15)" : "transparent",
                  paddingVertical: buttonPaddingVertical - 2,
                  paddingHorizontal: isTablet ? spacing(2.5) : spacing(1.5),
                }}
                accessibilityRole="button"
              >
                <View
                  style={{
                    flexDirection: "row-reverse",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Text style={{ color: colors.text, fontSize: bodyFontSize }}>
                    {option.name}
                  </Text>
                  <View
                    style={{
                      backgroundColor: option.value,
                      width: 18,
                      height: 18,
                      borderRadius: 9,
                    }}
                  />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View
          style={{
            backgroundColor: colors.card,
            borderRadius: cardRadius,
            padding: cardPadding,
            marginBottom: cardSpacing * 1.5,
            borderWidth: 1,
            borderColor: colors.divider,
          }}
        >
          <Text
            style={{
              color: colors.text,
              fontSize: titleFontSize,
              marginBottom: cardSpacing / 1.5,
              textAlign: "right",
              fontWeight: "700",
            }}
          >
            גודל טקסט
          </Text>
          <Text
            style={{
              color: colors.textMuted,
              fontSize: metaFontSize,
              marginBottom: cardSpacing / 2,
              textAlign: "right",
            }}
          >
            התאם את גודל הכתב בפיד ובתגובות
          </Text>
          <Slider
            value={fontSize}
            minimumValue={14}
            maximumValue={24}
            onValueChange={setFontSize}
            minimumTrackTintColor={colors.brand}
            maximumTrackTintColor={colors.divider}
            thumbTintColor={colors.brand}
          />
          <Text
            style={{
              color: colors.text,
              marginTop: cardSpacing / 2,
              fontSize: metaFontSize,
              textAlign: "right",
            }}
          >
            {Math.round(fontSize)}pt
          </Text>
        </View>

        <View
          style={{
            backgroundColor: colors.card,
            borderRadius: cardRadius,
            padding: cardPadding,
            borderWidth: 1,
            borderColor: colors.divider,
          }}
        >
          <Text
            style={{
              color: colors.text,
              fontSize: titleFontSize,
              marginBottom: cardSpacing / 1.5,
              textAlign: "right",
              fontWeight: "700",
            }}
          >
            התראות
          </Text>
          <View
            style={{
              flexDirection: "row-reverse",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: cardSpacing,
            }}
          >
            <View style={{ flex: 1, marginRight: spacing(2) }}>
              <Text style={{ color: colors.text, fontSize: bodyFontSize, textAlign: "right" }}>
                התראות כלליות
              </Text>
              <Text
                style={{
                  color: colors.textMuted,
                  fontSize: smallFontSize,
                  textAlign: "right",
                  marginTop: spacing(0.5),
                }}
              >
                קבל עדכון על פוסטים חדשים בנושאים שבחרת
              </Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={handleToggleNotifications}
              thumbColor={notificationsEnabled ? colors.brand : colors.divider}
              trackColor={{ false: "rgba(255,255,255,0.08)", true: "rgba(46,124,246,0.35)" }}
            />
          </View>
          <View
            style={{
              flexDirection: "row-reverse",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View style={{ flex: 1, marginRight: spacing(2) }}>
              <Text style={{ color: colors.text, fontSize: bodyFontSize, textAlign: "right" }}>
                התראות תגובות
              </Text>
              <Text
                style={{
                  color: colors.textMuted,
                  fontSize: smallFontSize,
                  textAlign: "right",
                  marginTop: spacing(0.5),
                }}
              >
                קבל הודעה כאשר מגיבים לדיונים שלך
              </Text>
            </View>
            <Switch
              value={commentNotifications}
              onValueChange={handleToggleComments}
              thumbColor={commentNotifications ? colors.brand : colors.divider}
              trackColor={{ false: "rgba(255,255,255,0.08)", true: "rgba(46,124,246,0.35)" }}
            />
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
