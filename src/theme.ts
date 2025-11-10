export const colors = {
  bg: '#0E1116',
  card: '#171A21',
  text: '#E8EEF2',
  textMuted: '#9AA4AF',
  brand: '#2E7CF6',
  success: '#25A55F',
  danger: '#E5484D',
  divider: 'rgba(255,255,255,0.06)',
};

export const radius = { md: 14, lg: 18 } as const;

export const spacing = (n = 1) => n * 8;

export const fonts = { title: 20, body: 16, meta: 13 } as const;

export const shadow = {
  card: {
    elevation: 4,
    shadowColor: 'rgba(0, 0, 0, 0.45)',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
  },
} as const;
