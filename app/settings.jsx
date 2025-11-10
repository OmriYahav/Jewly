import { useCallback, useMemo, useState } from "react";
import { ScrollView, View, Text, TouchableOpacity, Switch } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import Header from "./components/Header";
import ScreenContainer from "./components/layout/ScreenContainer";
import { useResponsiveValues } from "../src/hooks/useResponsiveValues";
import { colors, spacing, radius } from "../src/theme";

const themeOptions = [
  { name: "כחול", value: colors.brand },
  { name: "ירוק", value: colors.success },
  { name: "זהב", value: "#F4B942" },
];

const notificationModeOptions = [
  {
    label: "פעילות",
    value: "active",
    description: "הצג את כל ההתראות בזמן אמת",
  },
  {
    label: "מצב שקט",
    value: "quiet",
    description: "קבל רק התראות חשובות",
  },
];

const threadHighlightOptions = [
  {
    name: "קו צדדי",
    value: "side-line",
    description: "פס דק שמדגיש את השרשור הפעיל",
  },
  {
    name: "כל תגובה",
    value: "full-reply",
    description: "כל תגובה מקבלת רקע עדין",
  },
  {
    name: "רקע צבע",
    value: "colored-background",
    description: "השרשור כולו צבוע בגוון שבחרת",
  },
];

export default function SettingsScreen() {
  const [selectedColor, setSelectedColor] = useState(themeOptions[0].value);
  const [fontSize, setFontSize] = useState(16);
  const [selectedThreadHighlight, setSelectedThreadHighlight] = useState(
    threadHighlightOptions[0].value
  );
  const [notificationMode, setNotificationMode] = useState(
    notificationModeOptions[0].value
  );
  const [emergencyAlertsEnabled, setEmergencyAlertsEnabled] = useState(true);
  const [newPostNotifications, setNewPostNotifications] = useState(true);
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

  const highlightedOptions = useMemo(
    () =>
      threadHighlightOptions.map((option) => ({
        ...option,
        isSelected: selectedThreadHighlight === option.value,
      })),
    [selectedThreadHighlight]
  );

  const createSelectThreadHighlightHandler = useCallback(
    (value) => () => setSelectedThreadHighlight(value),
    []
  );

  const notificationModes = useMemo(
    () =>
      notificationModeOptions.map((option) => ({
        ...option,
        isSelected: option.value === notificationMode,
      })),
    [notificationMode]
  );

  const createSelectNotificationMode = useCallback(
    (value) => () => setNotificationMode(value),
    []
  );

  const handleToggleNotifications = useCallback(
    (value) => setNewPostNotifications(value),
    []
  );

  const handleToggleEmergency = useCallback(
    (value) => setEmergencyAlertsEnabled(value),
    []
  );

  const handleToggleComments = useCallback(
    (value) => setCommentNotifications(value),
    []
  );

  const notificationRows = useMemo(
    () => [
      {
        key: "emergency",
        title: "התראות חירום",
        description: "קבל עדכונים חשובים מהקהילה ומהצוות",
        icon: "alert-circle",
        iconColor: colors.danger,
        value: emergencyAlertsEnabled,
        onToggle: handleToggleEmergency,
      },
      {
        key: "posts",
        title: "התראת פוסט חדש",
        description: "קבל עדכון על פוסטים חדשים בנושאים שבחרת",
        icon: "notifications",
        iconColor: colors.brand,
        value: newPostNotifications,
        onToggle: handleToggleNotifications,
      },
      {
        key: "comments",
        title: "התראות תגובות",
        description: "קבל הודעה כאשר מגיבים לדיונים שלך",
        icon: "chatbubbles",
        iconColor: colors.success,
        value: commentNotifications,
        onToggle: handleToggleComments,
      },
    ], [
      commentNotifications,
      emergencyAlertsEnabled,
      handleToggleComments,
      handleToggleEmergency,
      handleToggleNotifications,
      newPostNotifications,
    ]
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
              marginBottom: cardSpacing / 2,
              textAlign: "right",
              fontWeight: "700",
            }}
          >
            צביעת שרשורים
          </Text>
          <Text
            style={{
              color: colors.textMuted,
              fontSize: metaFontSize,
              marginBottom: cardSpacing,
              textAlign: "right",
            }}
          >
            בחר איך להדגיש את התגובות בפיד
          </Text>
          <View style={{ rowGap: cardSpacing / 1.5 }}>
            {highlightedOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                onPress={createSelectThreadHighlightHandler(option.value)}
                style={{
                  borderRadius: radius.md + 4,
                  borderWidth: 1,
                  borderColor: option.isSelected ? colors.brand : colors.divider,
                  backgroundColor: option.isSelected
                    ? "rgba(46, 124, 246, 0.12)"
                    : "rgba(255,255,255,0.02)",
                  paddingVertical: buttonPaddingVertical,
                  paddingHorizontal: spacing(1.5),
                }}
                accessibilityRole="button"
              >
                <Text
                  style={{
                    color: colors.text,
                    fontSize: bodyFontSize,
                    textAlign: "right",
                    fontWeight: "600",
                  }}
                >
                  {option.name}
                </Text>
                <Text
                  style={{
                    color: colors.textMuted,
                    fontSize: smallFontSize,
                    textAlign: "right",
                    marginTop: spacing(0.5),
                  }}
                >
                  {option.description}
                </Text>
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
            marginBottom: cardSpacing * 1.5,
            borderWidth: 1,
            borderColor: colors.divider,
          }}
        >
          <Text
            style={{
              color: colors.text,
              fontSize: titleFontSize,
              marginBottom: cardSpacing / 2,
              textAlign: "right",
              fontWeight: "700",
            }}
          >
            דוגמה לטקסט
          </Text>
          <Text
            style={{
              color: colors.textMuted,
              fontSize: metaFontSize,
              marginBottom: cardSpacing,
              textAlign: "right",
            }}
          >
            כך יראו הפוסטים והתגובות לאחר שינוי הגודל
          </Text>
          <View
            style={{
              backgroundColor: "rgba(255,255,255,0.03)",
              borderRadius: radius.md,
              borderWidth: 1,
              borderColor: colors.divider,
              padding: spacing(2),
            }}
          >
            <Text
              style={{
                color: colors.text,
                fontSize: fontSize,
                lineHeight: fontSize * 1.5,
                textAlign: "right",
              }}
            >
              טקסט הדוגמה מציג כיצד גדלי פונטים שונים משפיעים על הקריאות בפיד. אפשר
              לכוונן לפי ההעדפה האישית שלך.
            </Text>
          </View>
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
              backgroundColor: "rgba(255,255,255,0.04)",
              borderRadius: radius.md,
              padding: 4,
              marginBottom: cardSpacing,
              gap: 4,
            }}
          >
            {notificationModes.map((option) => (
              <TouchableOpacity
                key={option.value}
                onPress={createSelectNotificationMode(option.value)}
                style={{
                  flex: 1,
                  backgroundColor: option.isSelected
                    ? "rgba(46,124,246,0.15)"
                    : "transparent",
                  paddingVertical: buttonPaddingVertical / 2,
                  borderRadius: radius.md,
                }}
              >
                <Text
                  style={{
                    color: option.isSelected ? colors.text : colors.textMuted,
                    fontSize: metaFontSize,
                    textAlign: "center",
                    fontWeight: option.isSelected ? "700" : "500",
                  }}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text
            style={{
              color: colors.textMuted,
              fontSize: smallFontSize,
              textAlign: "right",
              marginBottom: cardSpacing,
            }}
          >
            {notificationModes.find((option) => option.isSelected)?.description}
          </Text>
          <View style={{ rowGap: cardSpacing }}>
            {notificationRows.map((row) => (
              <View
                key={row.key}
                style={{
                  flexDirection: "row-reverse",
                  alignItems: "center",
                  justifyContent: "space-between",
                  backgroundColor: "rgba(255,255,255,0.02)",
                  borderRadius: radius.md,
                  paddingVertical: buttonPaddingVertical - 6,
                  paddingHorizontal: spacing(1.5),
                }}
              >
                <View
                  style={{
                    flexDirection: "row-reverse",
                    alignItems: "center",
                    flex: 1,
                    marginRight: spacing(1.5),
                    gap: spacing(1.5),
                  }}
                >
                  <View
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 19,
                      backgroundColor: "rgba(255,255,255,0.05)",
                      alignItems: "center",
                      justifyContent: "center",
                      borderWidth: 1,
                      borderColor: "rgba(255,255,255,0.08)",
                    }}
                  >
                    <Ionicons name={row.icon} size={20} color={row.iconColor} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        color: colors.text,
                        fontSize: bodyFontSize,
                        textAlign: "right",
                        fontWeight: "600",
                      }}
                    >
                      {row.title}
                    </Text>
                    <Text
                      style={{
                        color: colors.textMuted,
                        fontSize: smallFontSize,
                        textAlign: "right",
                        marginTop: spacing(0.5),
                      }}
                    >
                      {row.description}
                    </Text>
                  </View>
                </View>
                <View style={{ alignItems: "flex-end", gap: spacing(0.75) }}>
                  <Switch
                    value={row.value}
                    onValueChange={row.onToggle}
                    thumbColor={row.value ? colors.brand : colors.divider}
                    trackColor={{
                      false: "rgba(255,255,255,0.08)",
                      true: "rgba(46,124,246,0.35)",
                    }}
                  />
                  <View
                    style={{
                      backgroundColor: row.value
                        ? "rgba(46,124,246,0.18)"
                        : "rgba(255,255,255,0.06)",
                      borderRadius: radius.md,
                      paddingHorizontal: spacing(1),
                      paddingVertical: 4,
                    }}
                  >
                    <Text
                      style={{
                        color: row.value ? colors.text : colors.textMuted,
                        fontSize: smallFontSize,
                        textAlign: "center",
                      }}
                    >
                      {row.value ? "פעיל" : "כבוי"}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View
          style={{
            backgroundColor: colors.card,
            borderRadius: cardRadius,
            padding: cardPadding,
            marginTop: cardSpacing * 1.5,
            borderWidth: 1,
            borderColor: colors.divider,
          }}
        >
          <Text
            style={{
              color: colors.text,
              fontSize: titleFontSize,
              marginBottom: cardSpacing,
              textAlign: "right",
              fontWeight: "700",
            }}
          >
            שונות
          </Text>
          <View
            style={{
              backgroundColor: "rgba(255,255,255,0.04)",
              borderRadius: radius.md,
              padding: spacing(1.5),
              marginBottom: cardSpacing,
            }}
          >
            <Text style={{ color: colors.textMuted, fontSize: smallFontSize, textAlign: "right" }}>
              גירסה
            </Text>
            <Text style={{ color: colors.text, fontSize: bodyFontSize, textAlign: "right" }}>
              6.0.11 (880)
            </Text>
          </View>
          <View
            style={{
              backgroundColor: "rgba(255,255,255,0.04)",
              borderRadius: radius.md,
              padding: spacing(1.5),
            }}
          >
            <Text style={{ color: colors.textMuted, fontSize: smallFontSize, textAlign: "right" }}>
              מזהה מכשיר
            </Text>
            <Text
              style={{
                color: colors.text,
                fontSize: bodyFontSize,
                textAlign: "right",
                fontFamily: "monospace",
              }}
            >
              824e7cbf-52e3-4e15-bb86-c7efbe413962
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
