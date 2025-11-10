import { useMemo } from "react";
import { useWindowDimensions, Platform } from "react-native";

export function useResponsiveValues() {
  const { width } = useWindowDimensions();

  return useMemo(() => {
    const isTablet = width >= 768;
    const isCompact = width <= 360;

    const containerPadding = isTablet ? 32 : isCompact ? 16 : 24;
    const cardPadding = isTablet ? 24 : isCompact ? 16 : 20;
    const cardRadius = isTablet ? 28 : 24;
    const cardSpacing = isTablet ? 24 : 16;
    const titleFontSize = isTablet ? 28 : isCompact ? 22 : 24;
    const subtitleFontSize = isTablet ? 16 : isCompact ? 13 : 14;
    const bodyFontSize = isTablet ? 18 : isCompact ? 14 : 15;
    const metaFontSize = isTablet ? 15 : isCompact ? 12 : 13;
    const smallFontSize = isTablet ? 13 : isCompact ? 11 : 12;
    const buttonPaddingVertical = isTablet ? 18 : 14;
    const buttonFontSize = isTablet ? 17 : 15;
    const headerTopPadding = Platform.select({
      ios: isTablet ? 20 : 16,
      android: isTablet ? 24 : 18,
      default: 16,
    });
    const headerBottomPadding = isTablet ? 20 : 16;

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
