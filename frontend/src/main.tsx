import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";

async function deferRender() {
  if (import.meta.env.DEV) {
    const { worker } = await import("./mocks/browser.js");
    worker.start();
  }
}

deferRender().then(() => {
  createRoot(document.getElementById("root")!).render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
});
