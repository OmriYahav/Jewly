import { memo } from "react";
import { StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../../../src/theme";

const ScreenContainer = memo(function ScreenContainer({ children, style, statusBarStyle = "light-content" }) {
  return (
    <SafeAreaView
      style={[{ flex: 1, backgroundColor: colors.bg }, style]}
    >
      <StatusBar barStyle={statusBarStyle} backgroundColor={colors.bg} />
      {children}
    </SafeAreaView>
  );
});

export default ScreenContainer;
