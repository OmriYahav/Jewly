import "react-native-gesture-handler";
import "../global.css";

import { useEffect } from "react";
import { I18nManager, Platform } from "react-native";
import { Drawer } from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as Updates from "expo-updates";
import DrawerContent from "./navigation/DrawerContent";
import { COLORS, DRAWER } from "./constants/theme";

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
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <Drawer
        screenOptions={{
          headerShown: false,
          drawerPosition: "right",
          drawerType: "slide",
          swipeEdgeWidth: DRAWER.swipeEdgeWidth,
          sceneContainerStyle: {
            backgroundColor: COLORS.background,
          },
          overlayColor: COLORS.overlay,
          drawerStyle: {
            backgroundColor: COLORS.background,
            width: DRAWER.width,
          },
        }}
        drawerContent={(props) => <DrawerContent {...props} />}
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
