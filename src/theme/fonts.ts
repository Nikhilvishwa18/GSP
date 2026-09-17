export const fonts = {
  regular: "PlusJakartaSans_400Regular",
  medium: "PlusJakartaSans_500Medium",
  semiBold: "PlusJakartaSans_600SemiBold",
  bold: "PlusJakartaSans_700Bold",
  extraBold: "PlusJakartaSans_800ExtraBold",
} as const;

export const typeScale = {
  largeTitle: { fontSize: 34, lineHeight: 41, fontFamily: fonts.bold as string, letterSpacing: -0.4 },
  title1: { fontSize: 28, lineHeight: 34, fontFamily: fonts.bold as string, letterSpacing: -0.3 },
  title2: { fontSize: 22, lineHeight: 28, fontFamily: fonts.bold as string, letterSpacing: -0.2 },
  title3: { fontSize: 20, lineHeight: 25, fontFamily: fonts.semiBold as string },
  headline: { fontSize: 17, lineHeight: 22, fontFamily: fonts.semiBold as string },
  body: { fontSize: 17, lineHeight: 22, fontFamily: fonts.regular as string },
  callout: { fontSize: 16, lineHeight: 21, fontFamily: fonts.regular as string },
  subhead: { fontSize: 15, lineHeight: 20, fontFamily: fonts.regular as string },
  footnote: { fontSize: 13, lineHeight: 18, fontFamily: fonts.regular as string },
  caption1: { fontSize: 12, lineHeight: 16, fontFamily: fonts.medium as string },
  caption2: { fontSize: 11, lineHeight: 14, fontFamily: fonts.medium as string },
  caption3: { fontSize: 10, lineHeight: 13, fontFamily: fonts.medium as string },
} as const;
