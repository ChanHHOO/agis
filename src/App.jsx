import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navigation } from "./components/Navigation";
import { MainPage } from "./pages/MainPage";
import { ScreenDevelopmentAssistant } from "./pages/ScreenDevelopmentAssistant";
import { ReviewPage } from "./pages/ReviewPage";
import { CreateScreenPage } from "@/pages/CreateScreenPage";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route
              path="/screen-assistant/:screenId?"
              element={<ScreenDevelopmentAssistant />}
            />
            <Route path="/review/:screenId?" element={<ReviewPage />} />
            <Route path="/create-screen" element={<CreateScreenPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
