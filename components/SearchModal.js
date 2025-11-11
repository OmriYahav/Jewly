import { useCallback, useEffect, useMemo, useState } from "react";
import { FlatList, Modal, Pressable, Text, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAppearance } from "../src/context/AppearanceContext";

export default function SearchModal({ visible, onClose, posts = [], onSelectResult }) {
  const { colors, spacing, fonts, radius } = useAppearance();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleClose = useCallback(() => {
    if (typeof onClose === "function") {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    if (!visible) {
      setQuery("");
      setResults([]);
    }
  }, [visible]);

  const normalizedPosts = useMemo(() => (Array.isArray(posts) ? posts : []), [posts]);

  const handleSearch = useCallback((text) => {
    setQuery(text);
  }, []);

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

  const renderResult = useCallback(
    ({ item }) => (
      <Pressable
        onPress={() => handleSelect(item.id)}
        style={({ pressed }) => [
          {
            paddingVertical: spacing(2),
            paddingHorizontal: spacing(2),
            borderRadius: radius.md,
            backgroundColor: colors.surface,
            borderWidth: 1,
            borderColor: colors.divider,
            marginBottom: spacing(1),
          },
          pressed && { opacity: 0.85 },
        ]}
      >
        <Text
          style={{
            color: colors.text,
            fontSize: fonts.title,
            fontWeight: "700",
            textAlign: "right",
          }}
        >
          {item.title}
        </Text>
        <Text
          numberOfLines={2}
          style={{
            marginTop: spacing(0.5),
            color: colors.textMuted,
            fontSize: fonts.body,
            textAlign: "right",
          }}
        >
          {item.content}
        </Text>
      </Pressable>
    ),
    [colors.divider, colors.surface, colors.text, colors.textMuted, handleSelect, fonts.body, fonts.title, radius.md, spacing]
  );

  const keyExtractor = useCallback((item) => item.id, []);

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      statusBarTranslucent
      onRequestClose={handleClose}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(15, 23, 42, 0.55)",
          justifyContent: "center",
          paddingHorizontal: spacing(2),
        }}
      >
        <View
          style={{
            backgroundColor: colors.background,
            borderRadius: radius.lg,
            padding: spacing(2.5),
            maxHeight: "80%",
            borderWidth: 1,
            borderColor: colors.divider,
          }}
        >
          <View
            style={{
              flexDirection: "row-reverse",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: spacing(1.5),
            }}
          >
            <Text
              style={{
                color: colors.text,
                fontSize: fonts.title + 2,
                fontWeight: "800",
                textAlign: "right",
              }}
            >
              חיפוש
            </Text>
            <Pressable
              onPress={handleClose}
              style={({ pressed }) => [
                {
                  width: spacing(4),
                  height: spacing(4),
                  borderRadius: radius.md,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: colors.surface,
                  borderWidth: 1,
                  borderColor: colors.divider,
                },
                pressed && { opacity: 0.7 },
              ]}
              accessibilityRole="button"
              accessibilityLabel="סגירת חיפוש"
            >
              <Ionicons name="close" size={20} color={colors.brand} />
            </Pressable>
          </View>

          <TextInput
            value={query}
            onChangeText={handleSearch}
            placeholder="חיפוש בכל הפורומים..."
            placeholderTextColor={colors.textMuted}
            style={{
              backgroundColor: colors.surface,
              borderRadius: radius.md,
              borderWidth: 1,
              borderColor: colors.divider,
              paddingVertical: spacing(1.25),
              paddingHorizontal: spacing(2),
              fontSize: fonts.body,
              color: colors.text,
              textAlign: "right",
            }}
            autoFocus
          />

          <View style={{ marginTop: spacing(2), flex: 1 }}>
            {query.trim().length > 0 && results.length === 0 ? (
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                  paddingVertical: spacing(4),
                }}
              >
                <Text style={{ color: colors.textMuted, fontSize: fonts.body }}>
                  לא נמצאו תוצאות.
                </Text>
              </View>
            ) : (
              <FlatList
                data={results}
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
