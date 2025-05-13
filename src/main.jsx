import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import store, { persistor } from "./redux/store";
// import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";
import { MathJaxContext } from "better-react-mathjax";

const config = {
  loader: { load: ["[tex]/html"] },
  tex: {
    packages: { "[+]": ["html"] },
    inlineMath: [["$", "$"]],
    displayMath: [["$$", "$$"]],
  },
};


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* <MathJaxContext config={config}> */}
      <Toaster/>
      <App />
    {/* </MathJaxContext> */}
  </React.StrictMode>
);
