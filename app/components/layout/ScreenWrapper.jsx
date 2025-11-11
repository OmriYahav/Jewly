import { memo, useCallback } from "react";
import {
  BackHandler,
  Keyboard,
  Platform,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  I18nManager,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import ScreenContainer from "./ScreenContainer";
import { useAppearance } from "../../../src/context/AppearanceContext";

function ScreenWrapper({
  children,
  style,
  contentStyle,
  statusBarStyle,
  dismissKeyboard = true,
  showBackButton = true,
}) {
  const navigation = useNavigation();
  const { colors, spacing, radius } = useAppearance();
  const canGoBack = navigation?.canGoBack?.() ?? false;
  const shouldShowBackButton = showBackButton && canGoBack;

  useFocusEffect(
    useCallback(() => {
      if (Platform.OS !== "android") {
        return undefined;
      }

      const subscription = BackHandler.addEventListener("hardwareBackPress", () => {
        if (navigation?.canGoBack?.()) {
          navigation.goBack();
          return true;
        }
        return false;
      });

      return () => {
        subscription.remove();
      };
    }, [navigation])
  );

  const handleGoBack = useCallback(() => {
    if (navigation?.canGoBack?.()) {
      navigation.goBack();
    }
  }, [navigation]);

  const handleDismissKeyboard = useCallback(() => {
    if (dismissKeyboard) {
      Keyboard.dismiss();
    }
  }, [dismissKeyboard]);

  const content = (
    <View style={[{ flex: 1 }, contentStyle]}>
      {shouldShowBackButton ? (
        <View
          style={{
            paddingHorizontal: spacing(1.5),
            paddingTop: spacing(1),
            paddingBottom: spacing(0.5),
            flexDirection: "row",
            justifyContent: I18nManager.isRTL ? "flex-end" : "flex-start",
          }}
          pointerEvents="box-none"
        >
          <TouchableOpacity
            onPress={handleGoBack}
            accessibilityRole="button"
            accessibilityLabel="חזרה"
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            style={{
              backgroundColor: colors.surface,
              borderRadius: radius.lg,
              paddingVertical: spacing(0.75),
              paddingHorizontal: spacing(0.75),
              shadowColor: "rgba(15, 23, 42, 0.15)",
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.25,
              shadowRadius: 12,
              elevation: 3,
            }}
          >
            <Ionicons
              name={I18nManager.isRTL ? "chevron-forward" : "chevron-back"}
              size={22}
              color={colors.text}
            />
          </TouchableOpacity>
        </View>
      ) : null}
      <View style={{ flex: 1 }}>{children}</View>
    </View>
  );

  if (!dismissKeyboard) {
    return (
      <ScreenContainer style={style} statusBarStyle={statusBarStyle}>
        {content}
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer style={style} statusBarStyle={statusBarStyle}>
      <TouchableWithoutFeedback onPress={handleDismissKeyboard} accessible={false}>
        {content}
      </TouchableWithoutFeedback>
    </ScreenContainer>
  );
}

const MemoizedScreenWrapper = memo(ScreenWrapper);

/**
 * Higher-order helper for wrapping existing screen components without
 * changing their internal implementation.
 *
 * Example:
 *   function ExampleScreen() {
 *     return <Text>Content</Text>;
 *   }
 *   export default withScreenWrapper(ExampleScreen);
 */
export function withScreenWrapper(Component, wrapperProps) {
  function WithScreenWrapper(props) {
    return (
      <MemoizedScreenWrapper {...wrapperProps}>
        <Component {...props} />
      </MemoizedScreenWrapper>
    );
  }

  WithScreenWrapper.displayName = `withScreenWrapper(${Component.displayName || Component.name || "Component"})`;

  return WithScreenWrapper;
}

export default MemoizedScreenWrapper;
