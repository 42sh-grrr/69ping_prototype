import { App } from "./app";
import * as React from "react";
import { createRoot } from "react-dom/client";

const dom_root = document.getElementById("root");
if (!dom_root) {
  throw new Error("No root found");
}
const root = createRoot(dom_root);

root.render(<App />);

(window as any).customAngle = null;
// (window as any).customAngle = -45;

const frame = (t: number) => {
  t /= 1000;
  const angle = (window as any).customAngle ?? Math.sin(t / 10) * 45;
  document.documentElement.style.setProperty('--angle', `${angle}deg`);

  if (angle > 0) {
    document.body.classList.remove("angle-inverted");
  }
  else {
    document.body.classList.add("angle-inverted");
  }
  
  requestAnimationFrame(frame);
};
requestAnimationFrame(frame);
