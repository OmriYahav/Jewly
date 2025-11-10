import { memo } from "react";
import { SafeAreaView, StatusBar } from "react-native";
import { COLORS } from "../../constants/theme";

const ScreenContainer = memo(function ScreenContainer({ children, style, statusBarStyle = "light-content" }) {
  return (
    <SafeAreaView
      className="flex-1"
      style={[{ backgroundColor: COLORS.background }, style]}
    >
      <StatusBar barStyle={statusBarStyle} backgroundColor={COLORS.background} />
      {children}
    </SafeAreaView>
  );
});

export default ScreenContainer;
