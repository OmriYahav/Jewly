import { useMemo } from "react";
import { useWindowDimensions, Platform } from "react-native";
import { spacing, radius, fonts } from "../theme";

export function useResponsiveValues() {
  const { width } = useWindowDimensions();

  return useMemo(() => {
    const isTablet = width >= 768;
    const isCompact = width <= 360;

    const containerPadding = isTablet ? spacing(3) : isCompact ? spacing(1.5) : spacing(2);
    const cardPadding = isTablet ? spacing(3) : spacing(2);
    const cardRadius = isTablet ? radius.lg + 6 : radius.lg;
    const cardSpacing = spacing(2);
    const titleFontSize = isTablet ? 26 : 22;
    const subtitleFontSize = fonts.body;
    const bodyFontSize = isTablet ? 18 : 16;
    const metaFontSize = fonts.meta;
    const smallFontSize = isCompact ? fonts.meta : fonts.meta + 1;
    const buttonPaddingVertical = isTablet ? spacing(2.5) : spacing(2);
    const buttonFontSize = isTablet ? 18 : 16;
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
  }, [width]);
}
