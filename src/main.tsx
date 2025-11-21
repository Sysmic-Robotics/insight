import React from "react";
import ReactDOM from "react-dom/client";
import {HeroUIProvider} from "@heroui/react";
import App from "./App.tsx";
import "./index.css";
import { Provider } from 'react-redux';
import { store } from './store/store';

// set a black background for the app
document.body.style.backgroundColor = "#000";
document.body.style.margin = "0";


ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HeroUIProvider>
      <Provider store={store}>
        <App />
      </Provider>
    </HeroUIProvider>
  </React.StrictMode>,
);
