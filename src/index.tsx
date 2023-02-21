import { createRoot } from "react-dom/client";
import App from "./App";
import FaresBuilder from "./components/FaresBuilder";

declare global {
  interface Window {
    GtfsFaresBuilder: any;
  }
}

window.GtfsFaresBuilder = {
  mount: (props: any, container: any) => {
    createRoot(container).render(<FaresBuilder {...props} />);
  },
  unmount: (container: any) => {
    createRoot(container).unmount();
  },
};

const root = document.getElementById("gtfs-fares-builder-root") as HTMLElement;
if (root) {
  createRoot(root).render(<App />);
}
