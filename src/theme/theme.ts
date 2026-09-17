import { darkColors, lightColors } from "./colors";
import { fonts, typeScale } from "./fonts";

export const themeBase = {
  fonts,
  typeScale,

  radius: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    full: 9999,
  },

  spacing: {
    xxs: 2,
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
    xxxxl: 40,
    xxxxxl: 48,
  },
} as const;

export const lightTheme = { ...themeBase, colors: lightColors } as const;
export const darkTheme = { ...themeBase, colors: darkColors } as const;

export type AppTheme = Omit<typeof lightTheme, "colors"> & {
  colors: { [Key in keyof typeof lightColors]: string };
};
