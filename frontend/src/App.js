import React from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout, { LangProvider } from "./components/Layout";
import InstallPrompt from "./components/InstallPrompt";
import Tour from "./pages/Tour";
import Lost from "./pages/Lost";
import Chat from "./pages/Chat";
import Plan from "./pages/Plan";
import Group from "./pages/Group";
import Places from "./pages/Places";
import PlaceDetail from "./pages/PlaceDetail";

function App() {
  return (
    <div className="App">
      <LangProvider>
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Tour />} />
              <Route path="/tour" element={<Tour />} />
              <Route path="/lost" element={<Lost />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/plan" element={<Plan />} />
              <Route path="/group" element={<Group />} />
              <Route path="/places" element={<Places />} />
              <Route path="/places/:slug" element={<PlaceDetail />} />
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
