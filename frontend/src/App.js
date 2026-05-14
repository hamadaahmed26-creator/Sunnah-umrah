import React from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout, { LangProvider } from "./components/Layout";
import InstallPrompt from "./components/InstallPrompt";
import Tour from "./pages/Tour";
import Lost from "./pages/Lost";
import Chat from "./pages/Chat";
import Group from "./pages/Group";
import Places from "./pages/Places";
import PlaceDetail from "./pages/PlaceDetail";
import Hotels from "./pages/Hotels";
import Packages from "./pages/Packages";
import Qibla from "./pages/Qibla";
import Privacy from "./pages/Privacy";
import About from "./pages/About";
import Quiz from "./pages/Quiz";
import Ramadan from "./pages/Ramadan";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Settings from "./pages/Settings";
import AccessibilityPage from "./pages/Accessibility";
import BestMonths from "./pages/BestMonths";
import Plan from "./pages/Plan";
import WalkHaram from "./pages/WalkHaram";
import Faq from "./pages/Faq";
import Checklist from "./pages/Checklist";
import Miqat from "./pages/Miqat";
import Support from "./pages/Support";

function App() {
  return (
    <div className="App">
      <LangProvider>
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/home" element={<Home />} />
              <Route path="/tour" element={<Tour />} />
              <Route path="/lost" element={<Lost />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/group" element={<Group />} />
              <Route path="/group/join/:code" element={<Group />} />
              <Route path="/places" element={<Places />} />
              <Route path="/places/:slug" element={<PlaceDetail />} />
              <Route path="/hotels" element={<Hotels />} />
              <Route path="/packages" element={<Packages />} />
              <Route path="/qibla" element={<Qibla />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/about" element={<About />} />
              <Route path="/quiz" element={<Quiz />} />
              <Route path="/ramadan" element={<Ramadan />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/accessibility" element={<AccessibilityPage />} />
              <Route path="/best-months" element={<BestMonths />} />
              <Route path="/plan" element={<Plan />} />
              <Route path="/walk-haram" element={<WalkHaram />} />
              <Route path="/faq" element={<Faq />} />
              <Route path="/checklist" element={<Checklist />} />
              <Route path="/miqat" element={<Miqat />} />
              <Route path="/support" element={<Support />} />
              <Route path="/help" element={<Navigate to="/support" replace />} />
              {/* Sadaqah temporarily removed — donations create Apple App
                  Store risk under Guideline 3.2.1(vii) / 4.5.4. Old URLs
                  redirect home so existing bookmarks don't 404. */}
              <Route path="/sadaqah" element={<Navigate to="/" replace />} />
              <Route path="/sadaqah/success" element={<Navigate to="/" replace />} />
              {/* Old routes redirect into the tour */}
              <Route path="/guide" element={<Navigate to="/tour" replace />} />
              <Route path="/tawaf" element={<Navigate to="/tour" replace />} />
              <Route path="/sai" element={<Navigate to="/tour" replace />} />
            </Routes>
            <InstallPrompt />
          </Layout>
        </BrowserRouter>
      </LangProvider>
    </div>
  );
}

export default App;
