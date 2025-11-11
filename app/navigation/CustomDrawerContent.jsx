import { DrawerContentScrollView } from "@react-navigation/drawer";
import { View, Text, Pressable } from "react-native";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { useAppearance } from "../../src/context/AppearanceContext";

const GroupTitle = ({ children, style }) => <Text style={style}>{children}</Text>;

const Item = ({ icon, label, onPress, colors, spacing, radius, fonts, iconLibrary = "material" }) => {
  const IconComponent = iconLibrary === "ion" ? Ionicons : MaterialCommunityIcons;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        {
          backgroundColor: colors.surface,
        borderRadius: radius.md,
        paddingVertical: spacing(1.5),
        paddingHorizontal: spacing(2),
        marginBottom: spacing(1),
        flexDirection: "row-reverse",
        alignItems: "center",
        justifyContent: "space-between",
        borderWidth: 1,
        borderColor: colors.divider,
      },
      pressed && { opacity: 0.85 },
    ]}
    accessibilityRole="button"
  >
    <IconComponent name={icon} size={20} color={colors.brand} style={{ marginLeft: spacing(1) }} />
    <Text
      style={{
        color: colors.text,
        fontSize: fonts.body,
        fontWeight: "600",
      }}
    >
      {label}
    </Text>
  </Pressable>
  );
};

export default function CustomDrawerContent(props) {
  const { navigation } = props;
  const appearance = useAppearance();
  const { colors, spacing, radius, fonts } = appearance;

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
      contentContainerStyle={{
        padding: spacing(2),
        backgroundColor: colors.drawerBackground,
      }}
    >
      <View
        style={{
          paddingVertical: spacing(3),
          paddingHorizontal: spacing(1),
          alignItems: "flex-end",
        }}
      >
        <Text
          style={{
            color: colors.text,
            fontSize: fonts.title + 4,
            fontWeight: "800",
            textAlign: "right",
          }}
        >
          רוֹטר.נט
        </Text>
        <Text
          style={{
            color: colors.textMuted,
            fontSize: fonts.body,
            textAlign: "right",
            marginTop: 4,
          }}
        >
          פורום חדשות ודיונים
        </Text>
      </View>

      <GroupTitle
        style={{
          color: colors.textMuted,
          fontSize: fonts.body,
          marginTop: spacing(1),
          marginBottom: spacing(1),
          textAlign: "right",
        }}
      >
        פורומים
      </GroupTitle>
      <Item icon="plus-circle" label="פוסט חדש" onPress={handleNavigate("post/create")} colors={colors} spacing={spacing} radius={radius} fonts={fonts} />
      <Item icon="message-reply-text-outline" label="יש לי מה לומר" onPress={navigateToCategory("opinion", "יש לי מה לומר")} colors={colors} spacing={spacing} radius={radius} fonts={fonts} />
      <Item icon="file-document-outline" label="גילוי מסמכים" onPress={navigateToCategory("documents", "גילוי מסמכים")} colors={colors} spacing={spacing} radius={radius} fonts={fonts} />
      <Item icon="scale-balance" label="משפטים" onPress={navigateToCategory("law", "משפטים")} colors={colors} spacing={spacing} radius={radius} fonts={fonts} />
      <Item
        icon="megaphone-outline"
        label="סקופים"
        onPress={handleNavigate("scoop-forum")}
        colors={colors}
        spacing={spacing}
        radius={radius}
        fonts={fonts}
        iconLibrary="ion"
      />

      <GroupTitle
        style={{
          color: colors.textMuted,
          fontSize: fonts.body,
          marginTop: spacing(2),
          marginBottom: spacing(1),
          textAlign: "right",
        }}
      >
        פרטי חשבון
      </GroupTitle>
      <Item icon="login" label="התחברות" onPress={handleNavigate("login")} colors={colors} spacing={spacing} radius={radius} fonts={fonts} />

      <GroupTitle
        style={{
          color: colors.textMuted,
          fontSize: fonts.body,
          marginTop: spacing(2),
          marginBottom: spacing(1),
          textAlign: "right",
        }}
      >
        שונות
      </GroupTitle>
      <Item icon="cog-outline" label="הגדרות" onPress={handleNavigate("settings")} colors={colors} spacing={spacing} radius={radius} fonts={fonts} />
      <Item icon="block-helper" label="רשימת החסומים" onPress={handleNavigate()} colors={colors} spacing={spacing} radius={radius} fonts={fonts} />
      <Item icon="account-box-outline" label="יצירת קשר" onPress={handleNavigate()} colors={colors} spacing={spacing} radius={radius} fonts={fonts} />
    </DrawerContentScrollView>
  );
}
