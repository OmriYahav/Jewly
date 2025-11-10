import { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from "react-native";
import Header from "./components/Header";
import { useResponsiveValues } from "./hooks/useResponsiveValues";

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
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

  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar barStyle="light-content" backgroundColor="#0C0F14" />
      <Header title="התחברות" subtitle="הזן פרטי משתמש" />
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 24}
      >
        <View
          className="flex-1"
          style={{ paddingHorizontal: containerPadding, paddingTop: cardSpacing * 1.5 }}
        >
          <View
            className="bg-surface border border-border"
            style={{ borderRadius: cardRadius, padding: cardPadding }}
          >
            <Text className="text-text text-right" style={{ fontSize: bodyFontSize, marginBottom: cardSpacing / 2 }}>
              שם משתמש
            </Text>
            <TextInput
              className="bg-background/60 text-text border border-border text-right"
              style={{ borderRadius: cardRadius - 6, paddingHorizontal: 16, paddingVertical: 12, fontSize: bodyFontSize }}
              placeholder="הקלד שם משתמש"
              placeholderTextColor="rgba(229, 232, 239, 0.4)"
              value={username}
              onChangeText={setUsername}
              textAlign="right"
            />
            <Text
              className="text-text text-right"
              style={{ fontSize: bodyFontSize, marginTop: cardSpacing, marginBottom: cardSpacing / 2 }}
            >
              סיסמה
            </Text>
            <TextInput
              className="bg-background/60 text-text border border-border text-right"
              style={{ borderRadius: cardRadius - 6, paddingHorizontal: 16, paddingVertical: 12, fontSize: bodyFontSize }}
              placeholder="הקלד סיסמה"
              placeholderTextColor="rgba(229, 232, 239, 0.4)"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              textAlign="right"
            />
            <TouchableOpacity
              className="bg-accent rounded-full"
              style={{ paddingVertical: buttonPaddingVertical, marginTop: cardSpacing * 1.5 }}
              activeOpacity={0.85}
            >
              <Text
                className="text-background text-center font-semibold"
                style={{ fontSize: buttonFontSize }}
              >
                התחברות
              </Text>
            </TouchableOpacity>
            <Text
              className="text-text/60 text-right"
              style={{ fontSize: metaFontSize, marginTop: cardSpacing }}
            >
              פרטי ההתחברות לשימוש הדגמה בלבד.
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
