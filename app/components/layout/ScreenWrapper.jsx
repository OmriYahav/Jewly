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

function ScreenWrapper({
  children,
  style,
  contentStyle,
  statusBarStyle,
  dismissKeyboard = true,
}) {
  const navigation = useNavigation();
  const fadeAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnimation, {
      toValue: 1,
      duration: 320,
      useNativeDriver: true,
    }).start();
  }, [fadeAnimation]);

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
    <Animated.View style={[{ flex: 1, opacity: fadeAnimation }, contentStyle]}>
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
