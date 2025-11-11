import { useCallback, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from "react-native";
import { useRouter } from "expo-router";
import AppHeader from "../components/AppHeader";
import { withScreenWrapper } from "./components/layout/ScreenWrapper";
import { useResponsiveValues } from "../src/hooks/useResponsiveValues";
import { useAppearance } from "../src/context/AppearanceContext";

function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { colors, spacing, radius, fontFamily } = useAppearance();
  const {
    containerPadding,
    cardPadding,
    cardRadius,
    bodyFontSize,
    metaFontSize,
    buttonPaddingVertical,
    buttonFontSize,
    cardSpacing,
  } = useResponsiveValues();

  const handleSubmit = useCallback(() => {
    router.push("/");
  }, [router]);

  return (
    <>
      <AppHeader title="התחברות" subtitle="הזן פרטי משתמש" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 24}
      >
        <View
          style={{ paddingHorizontal: containerPadding, paddingTop: cardSpacing * 1.5, flex: 1 }}
        >
          <View
            style={{
              backgroundColor: colors.surface,
              borderRadius: cardRadius,
              padding: cardPadding,
              borderWidth: 1,
              borderColor: colors.divider,
              gap: cardSpacing,
            }}
          >
            <Text
              style={{
                color: colors.text,
                fontSize: bodyFontSize,
                textAlign: "right",
                fontWeight: "600",
                fontFamily,
              }}
            >
              שם משתמש
            </Text>
            <TextInput
              style={{
                backgroundColor: colors.background,
                color: colors.text,
                borderRadius: cardRadius - 6,
                paddingHorizontal: spacing(2),
                paddingVertical: spacing(1.5),
                fontSize: bodyFontSize,
                borderWidth: 1,
                borderColor: colors.divider,
                textAlign: "right",
                fontFamily,
              }}
              placeholder="הקלד שם משתמש"
              placeholderTextColor="rgba(71, 85, 105, 0.35)"
              value={username}
              onChangeText={setUsername}
            />
            <Text
              style={{
                color: colors.text,
                fontSize: bodyFontSize,
                textAlign: "right",
                fontWeight: "600",
                fontFamily,
              }}
            >
              סיסמה
            </Text>
            <TextInput
              style={{
                backgroundColor: colors.background,
                color: colors.text,
                borderRadius: cardRadius - 6,
                paddingHorizontal: spacing(2),
                paddingVertical: spacing(1.5),
                fontSize: bodyFontSize,
                borderWidth: 1,
                borderColor: colors.divider,
                textAlign: "right",
                fontFamily,
              }}
              placeholder="הקלד סיסמה"
              placeholderTextColor="rgba(71, 85, 105, 0.35)"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity
              style={{
                backgroundColor: colors.brand,
                borderRadius: radius.lg,
                paddingVertical: buttonPaddingVertical,
                marginTop: cardSpacing * 0.5,
              }}
              activeOpacity={0.85}
              onPress={handleSubmit}
              accessibilityRole="button"
            >
            <Text
              style={{
                color: colors.surface,
                textAlign: "center",
                fontSize: buttonFontSize,
                fontWeight: "700",
                fontFamily,
              }}
            >
              התחברות
            </Text>
          </TouchableOpacity>
          <Text
            style={{
              color: colors.textMuted,
              fontSize: metaFontSize,
              marginTop: cardSpacing,
              textAlign: "right",
              fontFamily,
            }}
          >
            פרטי ההתחברות לשימוש הדגמה בלבד.
          </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </>
  );
}

export default withScreenWrapper(LoginScreen);
