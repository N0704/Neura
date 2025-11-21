import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { store } from "./store";
import InitAuth from "./setup/InitAuth";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Provider store={store}>
      <InitAuth>
        <App />
      </InitAuth>
    </Provider>
  </BrowserRouter>
);
