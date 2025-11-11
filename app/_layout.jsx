import "react-native-gesture-handler";
import "../global.css";

import { useEffect, useMemo } from "react";
import { I18nManager, Platform, useWindowDimensions } from "react-native";
import { Drawer } from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as Updates from "expo-updates";
import CustomDrawerContent from "./navigation/CustomDrawerContent";
import { ForumProvider } from "../src/context/ForumContext";
import { AppearanceProvider, useAppearance } from "../src/context/AppearanceContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Provider as PaperProvider } from "react-native-paper";

function AppDrawer() {
  const { colors, radius } = useAppearance();
  const { width } = useWindowDimensions();
  const drawerWidth = Math.min(width * 0.8, 380);
  const paperTheme = useMemo(
    () => ({
      colors: {
        primary: colors.brand,
        secondary: colors.success,
        background: colors.background,
        surface: colors.surface,
        onSurface: colors.text,
        outline: colors.divider,
        onPrimary: colors.surface,
      },
      roundness: radius.md,
    }),
    [colors.background, colors.brand, colors.divider, colors.success, colors.surface, colors.text, radius.md]
  );

  return (
    <PaperProvider theme={paperTheme}>
      <Drawer
        screenOptions={{
          headerShown: false,
          drawerPosition: "right",
          drawerType: "front",
          swipeEdgeWidth: 120,
          sceneContainerStyle: {
            backgroundColor: colors.background,
          },
          overlayColor: "rgba(15, 23, 42, 0.25)",
          drawerStyle: {
            backgroundColor: colors.drawerBackground,
            width: drawerWidth,
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
          name="post/create"
          options={{
            drawerItemStyle: { display: "none" },
          }}
        />
        <Drawer.Screen
          name="settings"
          options={{
            drawerLabel: "הגדרות",
            title: "הגדרות",
            drawerIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="cog-outline" color={color} size={size} />
            ),
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
    </PaperProvider>
  );
}

export default function RootLayout() {
  useEffect(() => {
    if (Platform.OS === "web" || I18nManager.isRTL) {
      return;
    }

    I18nManager.allowRTL(true);
    I18nManager.forceRTL(true);
    I18nManager.swapLeftAndRightInRTL(true);

    if (typeof Updates.reloadAsync === "function") {
      Updates.reloadAsync().catch(() => undefined);
    }
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <SafeAreaProvider style={{ flex: 1 }}>
        <AppearanceProvider>
          <ForumProvider>
            <AppDrawer />
          </ForumProvider>
        </AppearanceProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
