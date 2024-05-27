import { App } from "./app";
import * as React from "react";
import { createRoot } from "react-dom/client";

const dom_root = document.getElementById("root");
if (!dom_root) {
  throw new Error("No root found");
}
const root = createRoot(dom_root);

root.render(<App />);

const frame = (t: number) => {
  t /= 1000;
  document.documentElement.style.setProperty('--angle', `${((Math.sin(t) + 1) / 2) * 45}deg`);
  requestAnimationFrame(frame);
};
requestAnimationFrame(frame);
