export const lightColors = {
  background: "#FFFFFF",
  surface: "#FFFFFF",
  card: "#FFFFFF",
  header: "#CFE8FA",
  text: "#0F172A",
  textMuted: "#475569",
  brand: "#1E77C3",
  success: "#1E9E63",
  danger: "#D64545",
  divider: "#E2E8F0",
  highlight: "#B5D8F7",
  highlightBorder: "#6CAFE9",
  drawerBackground: "#F6FAFF",
  subtleBackground: "#F1F5FB",
};

export const darkColors = {
  background: "#0E1116",
  surface: "#171A21",
  card: "#171A21",
  header: "#1F242B",
  text: "#E8EEF2",
  textMuted: "#9AA4AF",
  brand: "#4A90FF",
  success: "#25A55F",
  danger: "#E5484D",
  divider: "rgba(255,255,255,0.08)",
  highlight: "rgba(74, 144, 255, 0.18)",
  highlightBorder: "#4A90FF",
  drawerBackground: "#13171E",
  subtleBackground: "#10141A",
};

export const radius = { sm: 10, md: 14, lg: 20 } as const;

export const spacing = (n = 1) => n * 8;

export const baseFonts = { title: 22, body: 16, meta: 13, small: 12 } as const;

export const shadow = {
  card: {
    elevation: 2,
    shadowColor: "rgba(15, 23, 42, 0.18)",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.16,
    shadowRadius: 16,
  },
} as const;
