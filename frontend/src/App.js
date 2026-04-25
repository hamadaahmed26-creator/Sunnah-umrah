import React from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout, { LangProvider } from "./components/Layout";
import Home from "./pages/Home";
import Guide from "./pages/Guide";
import Tawaf from "./pages/Tawaf";
import Sai from "./pages/Sai";
import Lost from "./pages/Lost";
import Chat from "./pages/Chat";

function App() {
  return (
    <div className="App">
      <LangProvider>
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/guide" element={<Guide />} />
              <Route path="/tawaf" element={<Tawaf />} />
              <Route path="/sai" element={<Sai />} />
              <Route path="/lost" element={<Lost />} />
              <Route path="/chat" element={<Chat />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </LangProvider>
    </div>
  );
}

export default App;
