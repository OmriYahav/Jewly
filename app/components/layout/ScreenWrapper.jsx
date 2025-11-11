import { memo, useCallback, useEffect, useRef } from "react";
import {
  Animated,
  BackHandler,
  Keyboard,
  Platform,
  TouchableWithoutFeedback,
  View,
} from "react-native";
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
}) {
  const navigation = useNavigation();
  const { isDarkMode } = useAppearance();
  const fadeAnimation = useRef(new Animated.Value(isDarkMode ? 0.82 : 0.9)).current;
  const translateAnimation = useRef(new Animated.Value(18)).current;

  useEffect(() => {
    fadeAnimation.setValue(isDarkMode ? 0.82 : 0.9);
    translateAnimation.setValue(isDarkMode ? 22 : 18);

    Animated.parallel([
      Animated.timing(fadeAnimation, {
        toValue: 1,
        duration: 320,
        useNativeDriver: true,
      }),
      Animated.timing(translateAnimation, {
        toValue: 0,
        duration: 420,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnimation, isDarkMode, translateAnimation]);

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

  const handleDismissKeyboard = useCallback(() => {
    if (dismissKeyboard) {
      Keyboard.dismiss();
    }
  }, [dismissKeyboard]);

  const content = (
    <Animated.View
      style={[
        {
          flex: 1,
          opacity: fadeAnimation,
          transform: [{ translateY: translateAnimation }],
        },
        contentStyle,
      ]}
    >
      <View style={{ flex: 1 }}>{children}</View>
    </Animated.View>
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
