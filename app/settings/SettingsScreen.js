import { useCallback, useEffect, useMemo, useRef } from "react";
import { Animated, Pressable, StyleSheet, Switch, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
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
    shadow,
  } = appearance;
  const scrollY = useRef(new Animated.Value(0)).current;
  const { cardRadius } = useResponsiveValues();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        scrollContent: {
          paddingHorizontal: spacing(2.5),
          paddingBottom: spacing(6),
          alignItems: "center",
          gap: spacing(3),
        },
        card: {
          backgroundColor: colors.surfaceElevated ?? colors.surface,
          borderRadius: cardRadius,
          paddingVertical: spacing(3),
          paddingHorizontal: spacing(3),
          borderWidth: 1,
          borderColor: colors.cardBorder ?? colors.divider,
          gap: spacing(2.5),
          width: "100%",
          maxWidth: 560,
          ...shadow.card,
        },
        sectionHeader: {
          alignItems: "center",
          gap: spacing(0.5),
        },
        sectionTitle: {
          color: colors.text,
          fontSize: fonts.title + 2,
          fontWeight: "600",
          textAlign: "center",
          fontFamily,
          letterSpacing: 0.2,
        },
        sectionSubtitle: {
          color: colors.textMuted,
          fontSize: fonts.meta + 1,
          textAlign: "center",
          opacity: 0.7,
          fontFamily,
          lineHeight: (fonts.meta + 1) * 1.5,
        },
        optionRow: {
          flexDirection: "row-reverse",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: spacing(1),
        },
        optionButton: {
          borderRadius: radius.md,
          borderWidth: 1,
          borderColor: colors.cardBorder ?? colors.divider,
          backgroundColor: colors.surface,
          overflow: "hidden",
          minWidth: 108,
          minHeight: 48,
          ...shadow.card,
        },
        optionGradient: {
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          paddingVertical: spacing(1.25),
          paddingHorizontal: spacing(2.25),
        },
        optionInner: {
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          paddingVertical: spacing(1.25),
          paddingHorizontal: spacing(2.25),
          backgroundColor: colors.surface,
        },
        optionLabel: {
          color: colors.text,
          fontSize: fonts.body,
          fontWeight: "500",
          fontFamily,
          textAlign: "center",
          letterSpacing: 0.2,
        },
        optionLabelSelected: {
          color: "#FFFFFF",
        },
        sectionDivider: {
          height: StyleSheet.hairlineWidth,
          backgroundColor: colors.cardBorder ?? colors.divider,
          opacity: 0.35,
        },
        sliderContainer: {
          gap: spacing(1),
          alignItems: "center",
        },
        sliderValue: {
          color: colors.accent ?? colors.brand,
          fontSize: fonts.meta + 2,
          fontWeight: "600",
          textAlign: "center",
          fontFamily,
          letterSpacing: 0.3,
        },
        previewContainer: {
          backgroundColor: colors.subtleBackground,
          borderRadius: radius.lg,
          padding: spacing(2.5),
          borderWidth: 1,
          borderColor: colors.highlightBorder,
          gap: spacing(1.25),
        },
        previewTitle: {
          color: colors.textMuted,
          fontSize: fonts.meta,
          textAlign: "center",
          opacity: 0.7,
          fontFamily,
          letterSpacing: 0.2,
        },
        previewText: {
          color: colors.text,
          fontSize: fonts.body + 2,
          lineHeight: (fonts.body + 2) * 1.5,
          textAlign: "center",
          fontWeight: "500",
          fontFamily,
        },
        switchRow: {
          width: "100%",
          flexDirection: "row-reverse",
          alignItems: "center",
          justifyContent: "space-between",
          gap: spacing(2),
        },
        switchLabel: {
          flex: 1,
          color: colors.text,
          fontSize: fonts.body,
          fontWeight: "500",
          fontFamily,
          textAlign: "right",
        },
        switchWrapper: {
          borderRadius: radius.md,
          padding: spacing(0.25),
          backgroundColor: colors.iconBackground,
        },
      }),
    [
      cardRadius,
      colors.accent,
      colors.cardBorder,
      colors.divider,
      colors.highlightBorder,
      colors.iconBackground,
      colors.subtleBackground,
      colors.surface,
      colors.surfaceElevated,
      colors.text,
      colors.textMuted,
      fontFamily,
      fonts.body,
      fonts.meta,
      fonts.title,
      radius.lg,
      radius.md,
      shadow.card,
      spacing,
    ]
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

  const highlightOptions = useMemo(
    () => ROW_HIGHLIGHT_OPTIONS.filter((option) => option.value !== "none"),
    []
  );
  const isHighlightEnabled = rowHighlight !== "none";
  const lastHighlightRef = useRef(rowHighlight === "none" ? "side-line" : rowHighlight);

  useEffect(() => {
    if (rowHighlight !== "none") {
      lastHighlightRef.current = rowHighlight;
    }
  }, [rowHighlight]);

  const handleHighlightToggle = useCallback(
    (value) => {
      if (!value) {
        setRowHighlight("none");
        return;
      }
      const fallback = lastHighlightRef.current ?? "side-line";
      setRowHighlight(fallback === "none" ? "side-line" : fallback);
    },
    [setRowHighlight]
  );

  const renderOptionButtons = useCallback(
    (options, selected, onSelect) =>
      options.map((option) => {
        const isSelected = option.value === selected;
        const gradientColors = [colors.accent ?? colors.brand, colors.accentSecondary ?? colors.accent ?? colors.brand];

        return (
          <Pressable
            key={option.value}
            onPress={onSelect(option.value)}
            style={({ pressed }) => [
              styles.optionButton,
              isSelected && { borderColor: colors.highlightBorder, ...shadow.glow },
              pressed && { opacity: 0.9 },
            ]}
            accessibilityRole="button"
          >
            {isSelected ? (
              <LinearGradient
                colors={gradientColors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.optionGradient}
              >
                <Text style={[styles.optionLabel, styles.optionLabelSelected]}>{option.label}</Text>
              </LinearGradient>
            ) : (
              <View style={styles.optionInner}>
                <Text style={styles.optionLabel}>{option.label}</Text>
              </View>
            )}
          </Pressable>
        );
      }),
    [
      colors.accent,
      colors.accentSecondary,
      colors.brand,
      colors.highlightBorder,
      shadow.glow,
      styles.optionButton,
      styles.optionGradient,
      styles.optionInner,
      styles.optionLabel,
      styles.optionLabelSelected,
    ]
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
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>ערכת נושא</Text>
            <Text style={styles.sectionSubtitle}>בחירת מצב תצוגה לאפליקציה</Text>
          </View>
          <View style={styles.optionRow}>{renderOptionButtons(THEME_OPTIONS, themeMode, handleThemeChange)}</View>

          <View style={styles.sectionDivider} />

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>צביעת שרשורים</Text>
            <Text style={styles.sectionSubtitle}>אופן הדגשת תגובות בשרשור</Text>
          </View>
          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>הפעל הדגשה</Text>
            <View style={[styles.switchWrapper, isHighlightEnabled && shadow.glow]}>
              <Switch
                value={isHighlightEnabled}
                onValueChange={handleHighlightToggle}
                trackColor={{ false: colors.cardBorder ?? colors.divider, true: colors.highlight }}
                thumbColor={isHighlightEnabled ? colors.accent ?? colors.brand : colors.surface}
                ios_backgroundColor={colors.cardBorder ?? colors.divider}
                accessibilityLabel="הפעל הדגשת שרשורים"
              />
            </View>
          </View>
          {isHighlightEnabled ? (
            <View style={styles.optionRow}>
              {renderOptionButtons(highlightOptions, rowHighlight === "none" ? "side-line" : rowHighlight, handleHighlightChange)}
            </View>
          ) : null}

          <View style={styles.sectionDivider} />

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>גודל טקסט</Text>
            <Text style={styles.sectionSubtitle}>התאמת גודל הטקסט בפוסטים ותגובות</Text>
          </View>
          <View style={styles.sliderContainer}>
            <Slider
              value={textScale}
              onValueChange={handleTextScaleChange}
              minimumValue={0.8}
              maximumValue={1.3}
              step={0.01}
              minimumTrackTintColor={colors.accent ?? colors.brand}
              maximumTrackTintColor={colors.cardBorder ?? colors.divider}
              thumbTintColor={colors.accent ?? colors.brand}
              style={{ width: "100%" }}
            />
            <Text style={styles.sliderValue}>{sliderLabel}</Text>
          </View>

          <View style={styles.sectionDivider} />

          <View style={styles.previewContainer}>
            <Text style={styles.previewTitle}>דוגמה לטקסט</Text>
            <Text style={styles.previewText}>
              זו דוגמת טקסט המציגה את גודל הגופן והניגודיות החדשה. שינויי העיצוב חלים מיד על כל המסכים
              באפליקציה.
            </Text>
          </View>
        </View>
      </Animated.ScrollView>
    </>
  );
}

export default withScreenWrapper(SettingsScreen);
