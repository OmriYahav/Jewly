import { useMemo } from "react";
import { useWindowDimensions, Platform } from "react-native";
import { useAppearance } from "../context/AppearanceContext";

export function useResponsiveValues() {
  const { width } = useWindowDimensions();
  const { spacing, radius, fonts } = useAppearance();

  return useMemo(() => {
    const isTablet = width >= 768;
    const isCompact = width <= 360;

    const containerPadding = isTablet ? spacing(3) : isCompact ? spacing(1.5) : spacing(2);
    const cardPadding = isTablet ? spacing(3) : spacing(2);
    const cardRadius = isTablet ? radius.lg + 4 : radius.lg;
    const cardSpacing = spacing(2);
    const titleFontSize = isTablet ? fonts.title + 4 : fonts.title + 2;
    const subtitleFontSize = fonts.body;
    const bodyFontSize = isTablet ? fonts.body + 2 : fonts.body;
    const metaFontSize = fonts.meta;
    const smallFontSize = isCompact ? fonts.small : fonts.meta;
    const buttonPaddingVertical = isTablet ? spacing(2.5) : spacing(2);
    const buttonFontSize = isTablet ? fonts.body + 2 : fonts.body;
    const headerTopPadding = Platform.select({
      ios: isTablet ? spacing(3) : spacing(2),
      android: isTablet ? spacing(3) : spacing(2),
      default: spacing(2),
    });
    const headerBottomPadding = spacing(1.5);

    return {
      isTablet,
      isCompact,
      containerPadding,
      cardPadding,
      cardRadius,
      cardSpacing,
      titleFontSize,
      subtitleFontSize,
      bodyFontSize,
      metaFontSize,
      smallFontSize,
      buttonPaddingVertical,
      buttonFontSize,
      headerTopPadding,
      headerBottomPadding,
    };
  }, [fonts, radius, spacing, width]);
}
