import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { AuthProvider } from "./contexts/authContext/index.jsx";
import Kommunicate from "@kommunicate/kommunicate-chatbot-plugin/dist/index.js";

// Initialize Kommunicate chat widget
Kommunicate.init("3c33e2400ca58d7b37bbbf6b73cd95ade", {
  automaticChatOpenOnNavigation: true,
  popupWidget: true,
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>
);
