import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from "src/components/header/Header";
import ConnectYourWalletPage from "./pages/ConnectYourWalletPage";
import CounterPage from "./pages/CounterPage";
import InvalidChainPage from "./pages/InvalidChainPage";
import {
  COUNTER_CONTRACT_PATHNAME,
  HOME_PATHNAME,
  INVALID_CHAIN_PATHNAME,
} from "./routes/routes";

function App() {
  return (
    <div>
      <Header />

      <main>
        <BrowserRouter>
          <Routes>
            <Route path={HOME_PATHNAME} element={<ConnectYourWalletPage />} />
            <Route path={COUNTER_CONTRACT_PATHNAME} element={<CounterPage />} />
            <Route
              path={INVALID_CHAIN_PATHNAME}
              element={<InvalidChainPage />}
            />

            {/* TODO: CREATE WALLET DETAILS PAGE */}
          </Routes>
        </BrowserRouter>
      </main>
    </div>
  );
}

export default App;
