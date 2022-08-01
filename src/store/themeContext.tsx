import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from "react";
import { ThemeProvider as MUIThemeProvider } from "@emotion/react";
import { PaletteMode, Theme } from "@mui/material";

import getTheme, { DARK_THEME, LIGHT_THEME } from "src/theme/theme";

type themeContextValue = {
  theme: Theme;
  themeMode: PaletteMode;
  switchThemeMode: () => void;
  isDarkTheme: boolean;
  isLightTheme: boolean;
};

const initialState = {
  theme: getTheme(DARK_THEME),
  themeMode: DARK_THEME,
  switchThemeMode: () => {},
  isDarkTheme: true,
  isLightTheme: false,
};

const themeContext = createContext<themeContextValue>(initialState);

const useTheme = () => {
  const context = useContext(themeContext);

  if (!context) {
    throw new Error("useTheme should be used within a ThemeContext Provider");
  }

  return context;
};

const ThemeProvider = ({ children }: { children: JSX.Element }) => {
  const [themeMode, setThemeMode] = useState<PaletteMode>(DARK_THEME);

  const switchThemeMode = useCallback(() => {
    setThemeMode((prevThemeMode: PaletteMode) => {
      const isDarkTheme = prevThemeMode === DARK_THEME;
      return isDarkTheme ? LIGHT_THEME : DARK_THEME;
    });
  }, []);

  const theme = useMemo(() => getTheme(themeMode), [themeMode]);

  const isDarkTheme = themeMode === DARK_THEME;
  const isLightTheme = themeMode === LIGHT_THEME;

  const state = {
    theme,
    themeMode,
    switchThemeMode,

    isDarkTheme,
    isLightTheme,
  };
  return (
    <themeContext.Provider value={state}>
      <MUIThemeProvider theme={theme}>{children}</MUIThemeProvider>
    </themeContext.Provider>
  );
};

export { useTheme, ThemeProvider };
