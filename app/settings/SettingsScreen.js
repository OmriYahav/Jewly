import { useCallback, useMemo, useRef } from "react";
import { Animated, View, Text, StyleSheet } from "react-native";
import { Button, Divider } from "react-native-paper";
import Slider from "@react-native-community/slider";
import AppHeader from "../../components/AppHeader";
import { withScreenWrapper } from "../components/layout/ScreenWrapper";
import { useAppearance } from "../../src/context/AppearanceContext";
import { useResponsiveValues } from "../../src/hooks/useResponsiveValues";

const THEME_OPTIONS = [
  { label: "כהה", value: "dark" },
  { label: "בהיר", value: "light" },
  { label: "מערכת", value: "system" },
];

const ROW_HIGHLIGHT_OPTIONS = [
  { label: "ללא", value: "none" },
  { label: "רקע צבוע", value: "filled" },
  { label: "קו צדדי", value: "side-line" },
];

function SettingsScreen() {
  const appearance = useAppearance();
  const {
    colors,
    spacing,
    radius,
    fonts,
    fontFamily,
    themeMode,
    setThemeMode,
    rowHighlight,
    setRowHighlight,
    textScale,
    setTextScale,
  } = appearance;
  const scrollY = useRef(new Animated.Value(0)).current;
  const { cardRadius } = useResponsiveValues();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        scrollContent: {
          paddingHorizontal: spacing(2),
          paddingBottom: spacing(6),
          alignItems: "center",
          gap: spacing(2),
        },
        card: {
          backgroundColor: colors.surface,
          borderRadius: cardRadius,
          padding: spacing(2),
          borderWidth: 1,
          borderColor: colors.divider,
          shadowColor: "#ccc",
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.25,
          shadowRadius: 16,
          elevation: 4,
          gap: spacing(2),
          width: "100%",
          maxWidth: 520,
        },
        sectionTitle: {
          color: colors.text,
          fontSize: fonts.title + 2,
          fontWeight: "700",
          textAlign: "right",
          fontFamily,
        },
        sectionSubtitle: {
          color: colors.textMuted,
          fontSize: fonts.meta,
          textAlign: "right",
          fontFamily,
        },
        buttonRow: {
          flexDirection: "row-reverse",
          gap: spacing(1),
        },
        button: {
          flex: 1,
          borderRadius: radius.md,
          borderWidth: 1,
        },
        divider: {
          height: 1,
          backgroundColor: colors.divider,
        },
        sliderContainer: {
          marginTop: spacing(1),
        },
        sliderValue: {
          color: colors.brand,
          fontSize: fonts.meta,
          fontWeight: "700",
          textAlign: "left",
          fontFamily,
        },
        previewContainer: {
          backgroundColor: colors.subtleBackground,
          borderRadius: radius.md,
          padding: spacing(2),
        },
        previewTitle: {
          color: colors.textMuted,
          fontSize: fonts.meta,
          textAlign: "right",
          marginBottom: spacing(1),
          fontFamily,
        },
        previewText: {
          color: colors.text,
          fontSize: fonts.body + 2,
          lineHeight: (fonts.body + 2) * 1.5,
          textAlign: "right",
          fontWeight: "500",
          fontFamily,
        },
      }),
    [cardRadius, colors.brand, colors.divider, colors.subtleBackground, colors.surface, colors.text, colors.textMuted, fontFamily, fonts.body, fonts.meta, fonts.title, radius.md, spacing]
  );

  const handleThemeChange = useCallback(
    (value) => () => {
      setThemeMode(value);
    },
    [setThemeMode]
  );

  const handleHighlightChange = useCallback(
    (value) => () => {
      setRowHighlight(value);
    },
    [setRowHighlight]
  );

  const handleTextScaleChange = useCallback(
    (value) => {
      const normalized = Math.min(1.3, Math.max(0.8, Number.parseFloat(value.toFixed(2))));
      if (normalized !== textScale) {
        setTextScale(normalized);
      }
    },
    [setTextScale, textScale]
  );

  const sliderLabel = `${Math.round(textScale * 100)}%`;

  const renderOptionButtons = useCallback(
    (options, selected, onSelect) =>
      options.map((option) => {
        const isSelected = option.value === selected;
        return (
          <Button
            key={option.value}
            mode={isSelected ? "contained" : "outlined"}
            onPress={onSelect(option.value)}
            buttonColor={isSelected ? colors.highlight : colors.surface}
            textColor={isSelected ? colors.brand : colors.text}
            style={[
              styles.button,
              {
                borderColor: isSelected ? colors.highlightBorder : colors.divider,
              },
            ]}
            labelStyle={{
              fontSize: fonts.body,
              fontWeight: isSelected ? "700" : "500",
              fontFamily,
            }}
          >
            {option.label}
          </Button>
        );
      }),
    [colors.brand, colors.divider, colors.highlight, colors.highlightBorder, colors.surface, colors.text, fonts.body, styles.button]
  );

  return (
    <>
      <AppHeader title="הגדרות" subtitle="התאמה אישית של האפליקציה" scrollY={scrollY} />
      <Animated.ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>ערכת נושא</Text>
          <Text style={styles.sectionSubtitle}>בחירת מצב תצוגה לאפליקציה</Text>
          <View style={styles.buttonRow}>{renderOptionButtons(THEME_OPTIONS, themeMode, handleThemeChange)}</View>

          <Divider style={styles.divider} />

          <Text style={styles.sectionTitle}>צביעת שרשורים</Text>
          <Text style={styles.sectionSubtitle}>אופן הדגשת תגובות בשרשור</Text>
          <View style={styles.buttonRow}>
            {renderOptionButtons(ROW_HIGHLIGHT_OPTIONS, rowHighlight, handleHighlightChange)}
          </View>

          <Divider style={styles.divider} />

          <Text style={styles.sectionTitle}>גודל טקסט</Text>
          <Text style={styles.sectionSubtitle}>התאמת גודל הטקסט בפוסטים ותגובות</Text>
          <View style={styles.sliderContainer}>
            <Slider
              value={textScale}
              onValueChange={handleTextScaleChange}
              minimumValue={0.8}
              maximumValue={1.3}
              step={0.01}
            />
            <Text style={styles.sliderValue}>{sliderLabel}</Text>
          </View>

          <Divider style={styles.divider} />

          <View style={styles.previewContainer}>
            <Text style={styles.previewTitle}>דוגמא לטקסט</Text>
            <Text style={styles.previewText}>
              זו דוגמת טקסט המציגה את גודל הגופן והניגודיות החדשה. שינויי העיצוב חלים מיד על כל
              המסכים באפליקציה.
            </Text>
          </View>
        </View>
      </Animated.ScrollView>
    </>
  );
}

export default withScreenWrapper(SettingsScreen);
