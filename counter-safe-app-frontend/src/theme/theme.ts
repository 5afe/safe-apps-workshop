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
  zIndex: {
    appBar: 1250,
  },
};

const getTheme = (themeMode: PaletteMode): Theme => {
  return responsiveFontSizes(
    createTheme({
      ...themeOptions,
      palette: {
        ...themeOptions.palette,

        mode: themeMode,

        background:
          themeMode === LIGHT_THEME
            ? {
                default: "#eef5ec", // light body background color
              }
            : {},
      },
    })
  );
};

export default getTheme;
