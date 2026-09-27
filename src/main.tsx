import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { DemoStudentsProvider } from "./store/demoStudents";
import { NotificationProvider } from "./context/NotificationContext";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <NotificationProvider>
        <DemoStudentsProvider>
          <App />
        </DemoStudentsProvider>
      </NotificationProvider>
    </BrowserRouter>
  </StrictMode>
);
