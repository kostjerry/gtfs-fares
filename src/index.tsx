import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import FaresBuilder from "./components/FaresBuilder";

declare global {
  interface Window {
    GtfsFaresBuilder: any;
  }
}

window.GtfsFaresBuilder = {
  mount: (props: any, container: any) => {
    ReactDOM.render(<FaresBuilder {...props} />, container);
  },
  unmount: (container: any) => {
    ReactDOM.unmountComponentAtNode(container);
  },
};

const root = document.getElementById("gtfs-fares-builder-root") as HTMLElement;
if (root) {
  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    root
  );
}
