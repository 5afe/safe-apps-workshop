import { ThemeProvider } from "src/store/themeContext";
import { WalletProvider } from "src/store/walletContext";

const Providers = ({ children }: { children: JSX.Element }) => {
  return (
    <WalletProvider>
      <ThemeProvider>{children}</ThemeProvider>
    </WalletProvider>
  );
};

export default Providers;
