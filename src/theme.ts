export const lightColors = {
  background: "#FFFFFF",
  surface: "#FFFFFF",
  card: "#FFFFFF",
  header: "#D7ECFF",
  headerGradient: ["#D7ECFF", "#B8DAF0"],
  text: "#1A1A1A",
  textMuted: "#5E6B7C",
  brand: "#1E77C3",
  success: "#1E9E63",
  danger: "#D64545",
  divider: "#E4E9F2",
  highlight: "rgba(61, 139, 255, 0.08)",
  highlightBorder: "#3D8BFF",
  drawerBackground: "#F4F7FB",
  subtleBackground: "#F0F4FA",
  link: "#2E6BBE",
  iconBackground: "#FFFFFF",
  badgeBackground: "rgba(255, 80, 80, 0.15)",
  badgeText: "#D12E2E",
  cardBorder: "rgba(15, 23, 42, 0.08)",
  fabGradient: ["#3D8BFF", "#0078FF"],
};

export const darkColors = {
  background: "#181B20",
  surface: "#1C1F25",
  card: "#23272E",
  header: "#1C1F25",
  headerGradient: ["#1C1F25", "#1C1F25"],
  text: "#F3F4F6",
  textMuted: "#A7B1C2",
  brand: "#4DA3FF",
  success: "#3CD78C",
  danger: "#FF7676",
  divider: "rgba(255,255,255,0.08)",
  highlight: "rgba(77, 163, 255, 0.18)",
  highlightBorder: "#4DA3FF",
  drawerBackground: "#13171E",
  subtleBackground: "#181B20",
  link: "#4DA3FF",
  iconBackground: "rgba(255, 255, 255, 0.12)",
  badgeBackground: "rgba(255, 80, 80, 0.18)",
  badgeText: "#FF9A9A",
  cardBorder: "rgba(255, 255, 255, 0.06)",
  fabGradient: ["#3D8BFF", "#0078FF"],
};

export const radius = { sm: 10, md: 16, lg: 24 } as const;

export const spacing = (n = 1) => n * 8;

export const baseFonts = { title: 22, body: 16, meta: 13, small: 12 } as const;

export const shadow = {
  card: {
    elevation: 3,
    shadowColor: "rgba(15, 23, 42, 0.35)",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 22,
  },
  floating: {
    elevation: 6,
    shadowColor: "rgba(17, 25, 40, 0.25)",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
  },
  header: {
    elevation: 6,
    shadowColor: "rgba(17, 25, 40, 0.35)",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
  },
} as const;
