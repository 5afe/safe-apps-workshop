import {
  Theme,
  ThemeOptions,
  PaletteMode,
  responsiveFontSizes,
  createTheme,
} from "@mui/material";

export const DARK_THEME: PaletteMode = "dark";
export const LIGHT_THEME: PaletteMode = "light";

const themeOptions: ThemeOptions = {
  palette: {
    primary: {
      main: "#008c73",
    },
    mode: DARK_THEME,
  },
};

const getTheme = (themeMode: PaletteMode): Theme => {
  return responsiveFontSizes(
    createTheme({
      ...themeOptions,
      palette: {
        ...themeOptions.palette,
        mode: themeMode,
      },
    })
  );
};

export default getTheme;
