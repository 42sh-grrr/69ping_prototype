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

let targetAngle = 0;
let currentAngle = 0;

let oldT = 0;
const frame = (t: number) => {
  t /= 1000;
  targetAngle = (window as any).customAngle ?? Math.sin(t) * 45;

  const dt = t - oldT;
  const prop = Math.min(Math.max(dt * 10, 0), 1);
  currentAngle = (1 - prop) * currentAngle + prop * targetAngle;

  document.documentElement.style.setProperty('--angle', `${currentAngle}deg`);

  if (currentAngle > 0) {
    document.body.classList.remove("angle-inverted");
  }
  else {
    document.body.classList.add("angle-inverted");
  }
  
  oldT = t;
  requestAnimationFrame(frame);
};
requestAnimationFrame(frame);
