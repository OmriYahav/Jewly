import { memo } from "react";
import { StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppearance } from "../../../src/context/AppearanceContext";

const ScreenContainer = memo(function ScreenContainer({ children, style, statusBarStyle }) {
  const { colors, isDarkMode } = useAppearance();
  const barStyle = statusBarStyle ?? (isDarkMode ? "light-content" : "dark-content");

  return (
    <SafeAreaView
      style={[{ flex: 1, backgroundColor: colors.background }, style]}
    >
      <StatusBar barStyle={barStyle} backgroundColor={colors.background} />
      {children}
    </SafeAreaView>
  );
});

export default ScreenContainer;
