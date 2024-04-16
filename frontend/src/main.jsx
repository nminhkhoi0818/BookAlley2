import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./styles/main.scss";
import { Provider } from "react-redux";
import store from "./store.js";
import { injectStore } from "./utils/axios.js";
injectStore(store);

ReactDOM.createRoot(document.getElementById("root")).render(
  <>
    <Provider store={store}>
      <App />
    </Provider>
  </>
);
