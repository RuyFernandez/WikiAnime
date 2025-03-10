import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./Styles/reset.css"; // Reset global primero
import "./Styles/themes.css"; // Tema oscuro por defecto

import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
