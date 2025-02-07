import { StrictMode } from "react";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import store from "./Redux/Store.js"; // Import the store

// Render the application
createRoot(document.getElementById("root")).render(
  <Provider store={store}> {/* Pass store as a prop */}
    <BrowserRouter>
      <App />
      <Toaster />
    </BrowserRouter>
  </Provider>
);
