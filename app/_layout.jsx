import "react-native-gesture-handler";
import "../global.css";

import { useEffect } from "react";
import { I18nManager, Platform, View, Text } from "react-native";
import { Drawer } from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";
import * as Updates from "expo-updates";
import { forumCategories } from "../data/posts";

const accentColor = "#2A9DF4";
const surface = "#151922";
const borderColor = "#1F2531";

function SectionTitle({ title }) {
  return (
    <Text className="text-right text-xs text-text uppercase tracking-widest mt-6 mb-3" style={{ opacity: 0.7 }}>
      {title}
    </Text>
  );
}

function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={{
        flexGrow: 1,
        backgroundColor: "#0C0F14",
        paddingHorizontal: 16,
        paddingTop: Platform.OS === "android" ? 48 : 24,
      }}
    >
      <View className="flex-col" style={{ gap: 4 }}>
        <SectionTitle title="פורומים" />
        {forumCategories.map((category) => (
          <DrawerItem
            key={category.key}
            label={() => (
              <View className="flex-row-reverse items-center justify-between w-full">
                <Text className="text-text text-base" style={{ flex: 1, textAlign: "right" }}>
                  {category.label}
                </Text>
                <Ionicons name="chatbubble-outline" size={20} color={accentColor} />
              </View>
            )}
            style={{
              marginHorizontal: 0,
              borderRadius: 16,
              marginBottom: 8,
              backgroundColor: surface,
              borderWidth: 1,
              borderColor,
            }}
            onPress={() =>
              props.navigation.navigate("forum/[category]", {
                category: category.key,
                title: category.label,
              })
            }
          />
        ))}
        <SectionTitle title="פרטי חשבון" />
        <DrawerItem
          label={() => (
            <View className="flex-row-reverse items-center justify-between">
              <Text className="text-text text-base">התחברות</Text>
              <Ionicons name="log-in-outline" size={20} color={accentColor} />
            </View>
          )}
          style={{
            marginHorizontal: 0,
            borderRadius: 16,
            marginBottom: 8,
            backgroundColor: surface,
            borderWidth: 1,
            borderColor,
          }}
          onPress={() => props.navigation.navigate("login")}
        />
        <SectionTitle title="שונות" />
        {[
          { key: "settings", label: "הגדרות", icon: "settings-outline" },
          { key: "blocked", label: "רשימת החסומים", icon: "ban-outline" },
          { key: "contact", label: "יצירת קשר", icon: "mail-outline" },
        ].map((item) => (
          <DrawerItem
            key={item.key}
            label={() => (
              <View className="flex-row-reverse items-center justify-between">
                <Text className="text-text text-base">{item.label}</Text>
                <Ionicons name={item.icon} size={20} color={accentColor} />
              </View>
            )}
            style={{
              marginHorizontal: 0,
              borderRadius: 16,
              marginBottom: 8,
              backgroundColor: surface,
              borderWidth: 1,
              borderColor,
            }}
            onPress={() =>
              item.key === "settings"
                ? props.navigation.navigate("settings")
                : null
            }
          />
        ))}
      </View>
    </DrawerContentScrollView>
  );
}

export default function RootLayout() {
  useEffect(() => {
    if (!I18nManager.isRTL) {
      I18nManager.allowRTL(true);
      I18nManager.forceRTL(true);
      I18nManager.swapLeftAndRightInRTL(true);

      if (typeof Updates.reloadAsync === "function") {
        Updates.reloadAsync().catch(() => undefined);
      }
    }
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: "#0C0F14" }}>
      <Drawer
        screenOptions={{
          headerShown: false,
          drawerPosition: "right",
          drawerType: "slide",
          swipeEdgeWidth: 100,
          sceneContainerStyle: {
            backgroundColor: "#0C0F14",
          },
          overlayColor: "rgba(12, 15, 20, 0.75)",
          drawerStyle: {
            backgroundColor: "#0C0F14",
            width: 280,
          },
        }}
        drawerContent={(props) => <CustomDrawerContent {...props} />}
      >
        <Drawer.Screen
          name="index"
          options={{
            drawerLabel: "ראשי",
            title: "בית",
          }}
        />
        <Drawer.Screen
          name="forum/[category]"
          options={{
            drawerItemStyle: { display: "none" },
          }}
        />
        <Drawer.Screen
          name="post/[id]"
          options={{
            drawerItemStyle: { display: "none" },
          }}
        />
        <Drawer.Screen
          name="settings"
          options={{
            drawerLabel: "הגדרות",
            title: "הגדרות",
          }}
        />
        <Drawer.Screen
          name="login"
          options={{
            drawerLabel: "התחברות",
            title: "התחברות",
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}
