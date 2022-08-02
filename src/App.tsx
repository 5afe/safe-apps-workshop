import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from "src/components/header/Header";
import ConnectYourWalletPage from "./pages/ConnectYourWalletPage";
import CounterPage from "./pages/CounterPage";
import { COUNTER_CONTRACT_PATHNAME, HOME_PATHNAME } from "./routes/routes";

function App() {
  return (
    <div>
      <Header />

      <main>
        <BrowserRouter>
          <Routes>
            <Route path={HOME_PATHNAME} element={<ConnectYourWalletPage />} />
            <Route path={COUNTER_CONTRACT_PATHNAME} element={<CounterPage />} />

            {/* TODO: CREATE WALLET DETAILS PAGE */}
          </Routes>
        </BrowserRouter>
      </main>
    </div>
  );
}

export default App;
