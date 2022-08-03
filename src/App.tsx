import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from "src/components/header/Header";
import ConnectYourWalletPage from "./pages/ConnectYourWalletPage";
import CounterPage from "./pages/CounterPage";
import InvalidChainPage from "./pages/InvalidChainPage";
import WalletDetailsPage from "./pages/WalletDetailsPage";
import {
  COUNTER_CONTRACT_PATHNAME,
  HOME_PATHNAME,
  INVALID_CHAIN_PATHNAME,
  WALLET_DETAILS_PATHNAME,
} from "./routes/routes";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Header />
        <main>
          <Routes>
            <Route path={HOME_PATHNAME} element={<ConnectYourWalletPage />} />
            <Route path={COUNTER_CONTRACT_PATHNAME} element={<CounterPage />} />
            <Route
              path={INVALID_CHAIN_PATHNAME}
              element={<InvalidChainPage />}
            />
            <Route
              path={WALLET_DETAILS_PATHNAME}
              element={<WalletDetailsPage />}
            />
          </Routes>
        </main>
      </BrowserRouter>
    </div>
  );
}

export default App;
