import { DrawerContentScrollView } from "@react-navigation/drawer";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors, radius, spacing, fonts } from "../../src/theme";

const GroupTitle = ({ children }) => (
  <Text style={styles.groupTitle}>{children}</Text>
);

const Item = ({ icon, label, onPress }) => (
  <Pressable
    onPress={onPress}
    style={({ pressed }) => [styles.item, pressed && styles.itemPressed]}
    accessibilityRole="button"
  >
    <MaterialCommunityIcons name={icon} size={20} color={colors.brand} style={styles.itemIcon} />
    <Text style={styles.itemLabel}>{label}</Text>
  </Pressable>
);

export default function CustomDrawerContent(props) {
  const { navigation } = props;

  const handleNavigate = (target, params) => () => {
    if (target) {
      navigation.navigate(target, params);
    }
    navigation.closeDrawer();
  };

  const navigateToCategory = (category, title) => handleNavigate("forum/[category]", { category, title });

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.title}>רוֹטר.נט</Text>
        <Text style={styles.subtitle}>פורום חדשות ודיונים</Text>
      </View>

      <GroupTitle>פורומים</GroupTitle>
      <Item icon="message-reply-text-outline" label="יש לי מה לומר" onPress={navigateToCategory("opinion", "יש לי מה לומר")} />
      <Item icon="file-document-outline" label="גילוי מסמכים" onPress={navigateToCategory("documents", "גילוי מסמכים")} />
      <Item icon="scale-balance" label="משפטים" onPress={navigateToCategory("law", "משפטים")} />
      <Item icon="school-outline" label="בית המדרש" onPress={navigateToCategory("torah", "בית המדרש")} />

      <GroupTitle>פרטי חשבון</GroupTitle>
      <Item icon="login" label="התחברות" onPress={handleNavigate("login")} />

      <GroupTitle>שונות</GroupTitle>
      <Item icon="cog-outline" label="הגדרות" onPress={handleNavigate("settings")} />
      <Item icon="block-helper" label="רשימת החסומים" onPress={handleNavigate()} />
      <Item icon="account-box-outline" label="יצירת קשר" onPress={handleNavigate()} />
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing(2),
    backgroundColor: colors.bg,
  },
  header: {
    paddingVertical: spacing(3),
    paddingHorizontal: spacing(1),
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: "800",
    textAlign: "right",
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: fonts.body,
    textAlign: "right",
    marginTop: 4,
  },
  groupTitle: {
    color: colors.textMuted,
    fontSize: fonts.body,
    marginTop: spacing(2),
    marginBottom: spacing(1),
    textAlign: "right",
  },
  item: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    paddingVertical: spacing(1.5),
    paddingHorizontal: spacing(2),
    marginBottom: spacing(1),
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
  },
  itemPressed: {
    opacity: 0.9,
  },
  itemLabel: {
    color: colors.text,
    fontSize: fonts.body,
    fontWeight: "600",
  },
  itemIcon: {
    marginLeft: spacing(1),
  },
});
