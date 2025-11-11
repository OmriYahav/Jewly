import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { baseFonts, darkColors, lightColors, radius, shadow, spacing } from "../theme";

const STORAGE_KEYS = {
  themeMode: "appearance:theme-mode",
  rowHighlight: "appearance:row-highlight",
  textScale: "appearance:text-scale",
};

const DEFAULTS = {
  themeMode: "light",
  rowHighlight: "side-line",
  textScale: 1.07,
};

const FONT_FAMILY = "Assistant";

const AppearanceContext = createContext(null);

function scaleFonts(multiplier) {
  return Object.fromEntries(
    Object.entries(baseFonts).map(([key, value]) => [key, Math.round(value * multiplier * 100) / 100])
  );
}

function resolvePalette(mode, systemScheme) {
  if (mode === "system") {
    return systemScheme === "dark" ? darkColors : lightColors;
  }
  return mode === "dark" ? darkColors : lightColors;
}

function normalizeRowHighlight(value) {
  switch (value) {
    case "filled":
    case "colored-background":
    case "full-reply":
      return "filled";
    case "none":
      return "none";
    case "side-line":
    default:
      return "side-line";
  }
}

export function AppearanceProvider({ children }) {
  const systemScheme = useColorScheme();
  const [isLoaded, setIsLoaded] = useState(false);
  const [themeMode, setThemeMode] = useState(DEFAULTS.themeMode);
  const [rowHighlight, setRowHighlight] = useState(DEFAULTS.rowHighlight);
  const [textScale, setTextScale] = useState(DEFAULTS.textScale);

  useEffect(() => {
    let isMounted = true;
    AsyncStorage.multiGet(Object.values(STORAGE_KEYS))
      .then((entries) => {
        if (!isMounted || !Array.isArray(entries)) {
          return;
        }
        entries.forEach(([key, storedValue]) => {
          if (!storedValue) {
            return;
          }
          switch (key) {
            case STORAGE_KEYS.themeMode:
              setThemeMode(storedValue);
              break;
            case STORAGE_KEYS.rowHighlight:
              setRowHighlight(normalizeRowHighlight(storedValue));
              break;
            case STORAGE_KEYS.textScale: {
              const parsed = Number.parseFloat(storedValue);
              if (!Number.isNaN(parsed)) {
                setTextScale(parsed);
              }
              break;
            }
            default:
              break;
          }
        });
      })
      .catch(() => undefined)
      .finally(() => {
        if (isMounted) {
          setIsLoaded(true);
        }
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const palette = useMemo(() => resolvePalette(themeMode, systemScheme), [systemScheme, themeMode]);
  const fonts = useMemo(() => scaleFonts(textScale), [textScale]);

  const persistValue = useCallback(async (key, value) => {
    try {
      await AsyncStorage.setItem(key, String(value));
    } catch (error) {
      console.warn("Failed to persist appearance preference", error);
    }
  }, []);

  const handleThemeChange = useCallback(
    (mode) => {
      setThemeMode(mode);
      persistValue(STORAGE_KEYS.themeMode, mode);
    },
    [persistValue]
  );

  const handleRowHighlightChange = useCallback(
    (value) => {
      const normalized = normalizeRowHighlight(value);
      setRowHighlight(normalized);
      persistValue(STORAGE_KEYS.rowHighlight, normalized);
    },
    [persistValue]
  );

  const handleTextScaleChange = useCallback(
    (scale) => {
      setTextScale(scale);
      persistValue(STORAGE_KEYS.textScale, scale);
    },
    [persistValue]
  );

  const contextValue = useMemo(
    () => ({
      isLoaded,
      themeMode,
      setThemeMode: handleThemeChange,
      colors: palette,
      fonts,
      fontFamily: FONT_FAMILY,
      spacing,
      radius,
      shadow,
      rowHighlight,
      setRowHighlight: handleRowHighlightChange,
      textScale,
      setTextScale: handleTextScaleChange,
      isDarkMode: palette === darkColors,
    }),
    [
      fonts,
      handleRowHighlightChange,
      handleTextScaleChange,
      handleThemeChange,
      isLoaded,
      palette,
      rowHighlight,
      textScale,
      themeMode,
    ]
  );

  return <AppearanceContext.Provider value={contextValue}>{children}</AppearanceContext.Provider>;
}

export function useAppearance() {
  const context = useContext(AppearanceContext);
  if (!context) {
    throw new Error("useAppearance must be used within an AppearanceProvider");
  }
  return context;
}
