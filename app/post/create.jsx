import { useCallback, useMemo, useRef, useState } from "react";
import {
  Animated,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import AppHeader from "../../components/AppHeader";
import { withScreenWrapper } from "../components/layout/ScreenWrapper";
import { useForum } from "../../src/context/ForumContext";
import { useResponsiveValues } from "../../src/hooks/useResponsiveValues";
import { useAppearance } from "../../src/context/AppearanceContext";

function CreatePostScreen() {
  const router = useRouter();
  const { category } = useLocalSearchParams();
  const { categories, createPost } = useForum();
  const {
    containerPadding,
    cardPadding,
    cardRadius,
    bodyFontSize,
    titleFontSize,
    metaFontSize,
    buttonPaddingVertical,
    buttonFontSize,
    cardSpacing,
  } = useResponsiveValues();
  const { colors, spacing, radius, fontFamily } = useAppearance();
  const scrollY = useRef(new Animated.Value(0)).current;

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [tag, setTag] = useState("");
  const [content, setContent] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(() => {
    if (!category) return categories[0]?.key ?? "";
    return Array.isArray(category) ? category[0] : category;
  });

  const isValid = useMemo(
    () => title.trim().length > 2 && content.trim().length > 20 && selectedCategory,
    [content, selectedCategory, title]
  );

  const categoryOptions = useMemo(() => categories ?? [], [categories]);

  const handleCreatePost = useCallback(() => {
    if (!isValid) {
      return;
    }

    const newPost = createPost({
      title,
      author,
      tag,
      content,
      category: selectedCategory,
    });

    router.replace({ pathname: "/post/[id]", params: { id: newPost.id } });
  }, [author, content, createPost, isValid, router, selectedCategory, tag, title]);

  return (
    <>
      <AppHeader title="פוסט חדש" subtitle="הוסיפו דיון לקהילה" scrollY={scrollY} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 24}
      >
        <Animated.ScrollView
          style={{ flex: 1, paddingHorizontal: containerPadding }}
          contentContainerStyle={{ paddingBottom: cardSpacing * 3 }}
          showsVerticalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
          )}
          scrollEventThrottle={16}
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
            <View>
              <Text
                style={{
                  color: colors.text,
                  fontSize: titleFontSize,
                  fontWeight: "700",
                  textAlign: "right",
                  marginBottom: spacing(1),
                  fontFamily,
                }}
              >
                כותרת הפוסט
              </Text>
              <TextInput
                style={{
                  backgroundColor: colors.background,
                  color: colors.text,
                  borderRadius: radius.md,
                  paddingHorizontal: spacing(2),
                  paddingVertical: spacing(1.5),
                  fontSize: bodyFontSize,
                  borderWidth: 1,
                  borderColor: colors.divider,
                  textAlign: "right",
                  fontFamily,
                }}
                placeholder="על מה תרצו לדבר?"
                placeholderTextColor="rgba(71,85,105,0.35)"
                value={title}
                onChangeText={setTitle}
              />
            </View>

            <View>
              <Text
                style={{
                  color: colors.text,
                  fontSize: titleFontSize,
                  fontWeight: "700",
                  textAlign: "right",
                  marginBottom: spacing(1),
                  fontFamily,
                }}
              >
                בחרו פורום
              </Text>
              <View style={{ rowGap: spacing(1) }}>
                {categoryOptions.map((option) => {
                  const isSelected = option.key === selectedCategory;
                  return (
                    <TouchableOpacity
                      key={option.key}
                      onPress={() => setSelectedCategory(option.key)}
                      style={{
                        borderRadius: radius.md,
                        borderWidth: 1,
                        borderColor: isSelected ? colors.highlightBorder : colors.divider,
                        backgroundColor: isSelected ? colors.highlight : colors.subtleBackground,
                        paddingVertical: spacing(1.25),
                        paddingHorizontal: spacing(2),
                      }}
                      accessibilityRole="button"
                    >
                      <Text
                        style={{
                          color: isSelected ? colors.brand : colors.text,
                          fontSize: bodyFontSize,
                          textAlign: "right",
                          fontWeight: isSelected ? "700" : "500",
                          fontFamily,
                        }}
                      >
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <View>
              <Text
                style={{
                  color: colors.text,
                  fontSize: titleFontSize,
                  fontWeight: "700",
                  textAlign: "right",
                  marginBottom: spacing(1),
                  fontFamily,
                }}
              >
                שם כותב / ניק
              </Text>
              <TextInput
                style={{
                  backgroundColor: colors.background,
                  color: colors.text,
                  borderRadius: radius.md,
                  paddingHorizontal: spacing(2),
                  paddingVertical: spacing(1.5),
                fontSize: bodyFontSize,
                borderWidth: 1,
                borderColor: colors.divider,
                textAlign: "right",
                fontFamily,
              }}
                placeholder="למי לתת קרדיט?"
                placeholderTextColor="rgba(71,85,105,0.35)"
                value={author}
                onChangeText={setAuthor}
              />
            </View>

            <View>
              <Text
                style={{
                  color: colors.text,
                  fontSize: titleFontSize,
                  fontWeight: "700",
                  textAlign: "right",
                  marginBottom: spacing(1),
                  fontFamily,
                }}
              >
                תגית (לא חובה)
              </Text>
              <TextInput
                style={{
                  backgroundColor: colors.background,
                  color: colors.text,
                  borderRadius: radius.md,
                  paddingHorizontal: spacing(2),
                  paddingVertical: spacing(1.5),
                  fontSize: bodyFontSize,
                  borderWidth: 1,
                  borderColor: colors.divider,
                  textAlign: "right",
                  fontFamily,
                }}
                placeholder="לדוגמה: דיווח מיוחד"
                placeholderTextColor="rgba(71,85,105,0.35)"
                value={tag}
                onChangeText={setTag}
              />
            </View>

            <View>
              <Text
                style={{
                  color: colors.text,
                  fontSize: titleFontSize,
                  fontWeight: "700",
                  textAlign: "right",
                  marginBottom: spacing(1),
                  fontFamily,
                }}
              >
                תוכן הפוסט
              </Text>
              <TextInput
                style={{
                  backgroundColor: colors.background,
                  color: colors.text,
                  borderRadius: radius.md,
                  paddingHorizontal: spacing(2),
                  paddingVertical: spacing(1.5),
                  fontSize: bodyFontSize,
                  borderWidth: 1,
                  borderColor: colors.divider,
                  textAlign: "right",
                  minHeight: spacing(20),
                  fontFamily,
                }}
                placeholder="ספרו לנו את כל הפרטים החשובים..."
                placeholderTextColor="rgba(71,85,105,0.35)"
                value={content}
                onChangeText={setContent}
                multiline
              />
              <Text
                style={{
                  color: colors.textMuted,
                  fontSize: metaFontSize,
                  textAlign: "right",
                  marginTop: spacing(0.5),
                  fontFamily,
                }}
              >
                יש לכתוב לפחות 20 תווים כדי לפרסם.
              </Text>
            </View>

            <TouchableOpacity
              style={{
                backgroundColor: isValid ? colors.brand : colors.subtleBackground,
                borderRadius: radius.lg,
                paddingVertical: buttonPaddingVertical,
                borderWidth: isValid ? 0 : 1,
                borderColor: colors.divider,
              }}
              activeOpacity={0.9}
              onPress={handleCreatePost}
              accessibilityRole="button"
              disabled={!isValid}
            >
              <Text
                style={{
                  color: isValid ? colors.surface : colors.textMuted,
                  textAlign: "center",
                  fontSize: buttonFontSize,
                  fontWeight: "700",
                  fontFamily,
                }}
              >
                פרסום הפוסט
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}

export default withScreenWrapper(CreatePostScreen);
