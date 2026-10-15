import { Routes, Route } from "react-router-dom";
import { HashRouter } from "react-router-dom";

import { CharacterPage } from "./pages/CharacterPage";
import { HomePage } from "./pages/HomePage";

export const App = () => (
  <HashRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/character/:id" element={<CharacterPage />} />
    </Routes>
  </HashRouter>
);

export default App;
