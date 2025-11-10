import "react-native-gesture-handler";
import "../global.css";

import { useEffect } from "react";
import { I18nManager, Platform, useWindowDimensions } from "react-native";
import { Drawer } from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as Updates from "expo-updates";
import CustomDrawerContent from "./navigation/CustomDrawerContent";
import { colors } from "../src/theme";

export default function RootLayout() {
  const { width } = useWindowDimensions();
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

  const drawerWidth = Math.min(width * 0.8, 380);

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.bg }}>
      <SafeAreaProvider style={{ flex: 1 }}>
        <Drawer
          screenOptions={{
            headerShown: false,
            drawerPosition: "right",
            drawerType: "front",
            swipeEdgeWidth: 120,
            sceneContainerStyle: {
              backgroundColor: colors.bg,
            },
            overlayColor: "rgba(0,0,0,0.45)",
            drawerStyle: {
              backgroundColor: colors.bg,
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
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
