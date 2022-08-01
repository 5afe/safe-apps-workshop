import { WalletProvider } from "src/store/walletContext";
import { ThemeProvider } from "src/store/themeContext";
import { CounterProvider } from "src/store/counterContext";

const Providers = ({ children }: { children: JSX.Element }) => {
  return (
    <WalletProvider>
      <ThemeProvider>
        <CounterProvider>{children}</CounterProvider>
      </ThemeProvider>
    </WalletProvider>
  );
};

export default Providers;
