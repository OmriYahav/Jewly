import { useCallback, useEffect, useMemo, useState } from "react";
import {
  FlatList,
  Keyboard,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAppearance } from "../src/context/AppearanceContext";

export default function SearchModal({ visible, onClose, posts = [], onSelectResult }) {
  const { colors, spacing, fonts, radius, fontFamily, shadow } = useAppearance();
  const [inputValue, setInputValue] = useState("");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleClose = useCallback(() => {
    if (typeof onClose === "function") {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    if (!visible) {
      setInputValue("");
      setQuery("");
      setResults([]);
      setHasSearched(false);
    }
  }, [visible]);

  const normalizedPosts = useMemo(() => (Array.isArray(posts) ? posts : []), [posts]);

  const handleChangeText = useCallback((text) => {
    setInputValue(text);
  }, []);

  const handleSubmitSearch = useCallback(() => {
    Keyboard.dismiss();
    const normalizedQuery = inputValue.trim();

    if (normalizedQuery.length === 0) {
      setHasSearched(false);
      setQuery("");
      setResults([]);
      return;
    }

    setHasSearched(true);
    setQuery(normalizedQuery);
  }, [inputValue]);

  useEffect(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();

    if (normalizedQuery.length === 0) {
      setResults([]);
      return;
    }

    const filtered = normalizedPosts.filter((post) => {
      const title = post.title?.toLocaleLowerCase() ?? "";
      const content = post.content?.toLocaleLowerCase() ?? "";
      return title.includes(normalizedQuery) || content.includes(normalizedQuery);
    });

    setResults(filtered);
  }, [normalizedPosts, query]);

  const handleSelect = useCallback(
    (postId) => {
      if (typeof onSelectResult === "function") {
        onSelectResult(postId);
      }
    },
    [onSelectResult]
  );

  const styles = useMemo(
    () =>
      StyleSheet.create({
        backdrop: {
          flex: 1,
          backgroundColor: colors.overlay,
          justifyContent: "center",
          paddingHorizontal: spacing(2.5),
        },
        container: {
          backgroundColor: colors.surfaceElevated ?? colors.surface,
          borderRadius: radius.lg,
          padding: spacing(3),
          maxHeight: "78%",
          borderWidth: 1,
          borderColor: colors.cardBorder ?? colors.divider,
          gap: spacing(2),
          ...shadow.card,
        },
        header: {
          flexDirection: "row-reverse",
          alignItems: "center",
          justifyContent: "space-between",
        },
        title: {
          color: colors.text,
          fontSize: fonts.title + 2,
          fontWeight: "600",
          textAlign: "center",
          flex: 1,
          fontFamily,
          letterSpacing: 0.3,
        },
        closeButton: {
          width: spacing(4.5),
          height: spacing(4.5),
          borderRadius: radius.md,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: colors.iconBackground,
          borderWidth: 1,
          borderColor: colors.highlightBorder,
          ...shadow.glow,
        },
        input: {
          backgroundColor: colors.surface,
          borderRadius: radius.md,
          borderWidth: 1,
          borderColor: isFocused ? colors.accent : colors.cardBorder ?? colors.divider,
          paddingVertical: spacing(1.5),
          paddingHorizontal: spacing(2),
          fontSize: fonts.body,
          color: colors.text,
          textAlign: "right",
          fontFamily,
        },
        searchButton: {
          backgroundColor: colors.brand ?? colors.accent,
          borderRadius: radius.md,
          paddingVertical: spacing(1.75),
          paddingHorizontal: spacing(2),
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row-reverse",
          columnGap: spacing(1),
        },
        searchButtonText: {
          color: "#FFFFFF",
          fontSize: fonts.body,
          fontWeight: "600",
          fontFamily,
          letterSpacing: 0.4,
        },
        results: {
          flex: 1,
        },
        resultCard: {
          paddingVertical: spacing(2),
          paddingHorizontal: spacing(2.25),
          borderRadius: radius.md,
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: colors.cardBorder ?? colors.divider,
          marginBottom: spacing(1.5),
          gap: spacing(0.75),
        },
        resultTitle: {
          color: colors.text,
          fontSize: fonts.title,
          fontWeight: "600",
          textAlign: "right",
          lineHeight: fonts.title * 1.5,
          fontFamily,
        },
        resultContent: {
          color: colors.textMuted,
          fontSize: fonts.body,
          textAlign: "right",
          lineHeight: fonts.body * 1.5,
          fontFamily,
        },
        emptyState: {
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          paddingVertical: spacing(4),
        },
        emptyText: {
          color: colors.textMuted,
          fontSize: fonts.body,
          fontFamily,
          textAlign: "center",
          lineHeight: fonts.body * 1.5,
        },
      }),
    [
      colors.accent,
      colors.brand,
      colors.cardBorder,
      colors.divider,
      colors.highlightBorder,
      colors.iconBackground,
      colors.overlay,
      colors.surface,
      colors.surfaceElevated,
      colors.text,
      colors.textMuted,
      fonts.body,
      fonts.title,
      fontFamily,
      isFocused,
      radius.lg,
      radius.md,
      shadow.card,
      shadow.glow,
      spacing,
    ]
  );

  const renderResult = useCallback(
    ({ item }) => (
      <Pressable
        onPress={() => handleSelect(item.id)}
        style={({ pressed }) => [styles.resultCard, pressed && { opacity: 0.85 }]}
      >
        <Text style={styles.resultTitle}>{item.title}</Text>
        <Text numberOfLines={2} style={styles.resultContent}>
          {item.content}
        </Text>
      </Pressable>
    ),
    [handleSelect, styles]
  );

  const keyExtractor = useCallback((item) => String(item.id), []);

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      statusBarTranslucent
      onRequestClose={handleClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Pressable
              onPress={handleClose}
              style={({ pressed }) => [styles.closeButton, pressed && { opacity: 0.75 }]}
              accessibilityRole="button"
              accessibilityLabel="סגירת חיפוש"
            >
              <Ionicons name="close" size={20} color={colors.accent ?? colors.brand} />
            </Pressable>
            <Text style={styles.title}>חיפוש</Text>
          </View>

          <TextInput
            value={inputValue}
            onChangeText={handleChangeText}
            placeholder="חיפוש בכל הפורומים..."
            placeholderTextColor={colors.textMuted}
            style={styles.input}
            autoFocus
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            returnKeyType="search"
            onSubmitEditing={handleSubmitSearch}
          />

          <Pressable
            onPress={handleSubmitSearch}
            style={({ pressed }) => [styles.searchButton, pressed && { opacity: 0.9 }]}
            accessibilityRole="button"
            accessibilityLabel="ביצוע חיפוש"
          >
            <Ionicons name="search" size={18} color="#FFFFFF" />
            <Text style={styles.searchButtonText}>חיפוש</Text>
          </Pressable>

          <View style={styles.results}>
            {!hasSearched ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>הקלד מונח ולחץ על כפתור החיפוש כדי לראות תוצאות.</Text>
              </View>
            ) : query.trim().length > 0 && results.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>לא נמצאו תוצאות.</Text>
              </View>
            ) : (
              <FlatList
                data={hasSearched ? results : []}
                keyExtractor={keyExtractor}
                renderItem={renderResult}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                  paddingBottom: spacing(2),
                }}
              />
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}
