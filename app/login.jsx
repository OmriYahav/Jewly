import { useCallback, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from "react-native";
import { useRouter } from "expo-router";
import Header from "./components/Header";
import ScreenContainer from "./components/layout/ScreenContainer";
import { useResponsiveValues } from "./hooks/useResponsiveValues";
import { colors, spacing, radius } from "../src/theme";

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
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
    <ScreenContainer>
      <Header title="התחברות" subtitle="הזן פרטי משתמש" />
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
              backgroundColor: colors.card,
              borderRadius: cardRadius,
              padding: cardPadding,
              borderWidth: 1,
              borderColor: colors.divider,
            }}
          >
            <Text
              style={{
                color: colors.text,
                fontSize: bodyFontSize,
                marginBottom: cardSpacing / 2,
                textAlign: "right",
                fontWeight: "600",
              }}
            >
              שם משתמש
            </Text>
            <TextInput
              style={{
                backgroundColor: colors.bg,
                color: colors.text,
                borderRadius: cardRadius - 6,
                paddingHorizontal: spacing(2),
                paddingVertical: spacing(1.5),
                fontSize: bodyFontSize,
                borderWidth: 1,
                borderColor: colors.divider,
                textAlign: "right",
              }}
              placeholder="הקלד שם משתמש"
              placeholderTextColor="rgba(232, 238, 242, 0.4)"
              value={username}
              onChangeText={setUsername}
            />
            <Text
              style={{
                color: colors.text,
                fontSize: bodyFontSize,
                marginTop: cardSpacing,
                marginBottom: cardSpacing / 2,
                textAlign: "right",
                fontWeight: "600",
              }}
            >
              סיסמה
            </Text>
            <TextInput
              style={{
                backgroundColor: colors.bg,
                color: colors.text,
                borderRadius: cardRadius - 6,
                paddingHorizontal: spacing(2),
                paddingVertical: spacing(1.5),
                fontSize: bodyFontSize,
                borderWidth: 1,
                borderColor: colors.divider,
                textAlign: "right",
              }}
              placeholder="הקלד סיסמה"
              placeholderTextColor="rgba(232, 238, 242, 0.4)"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity
              style={{
                backgroundColor: colors.brand,
                borderRadius: radius.lg,
                paddingVertical: buttonPaddingVertical,
                marginTop: cardSpacing * 1.5,
              }}
              activeOpacity={0.85}
              onPress={handleSubmit}
              accessibilityRole="button"
            >
              <Text
                style={{
                  color: colors.bg,
                  textAlign: "center",
                  fontSize: buttonFontSize,
                  fontWeight: "700",
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
              }}
            >
              פרטי ההתחברות לשימוש הדגמה בלבד.
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}
