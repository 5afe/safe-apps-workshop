import Header from "src/components/header/Header";
import CounterPage from "./pages/CounterPage";

function App() {
  return (
    <div>
      <Header />

      {/* TODO: Add react router */}
      <main>
        <CounterPage />
      </main>
    </div>
  );
}

export default App;
