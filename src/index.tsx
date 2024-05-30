import { App } from "./app";
import * as React from "react";
import { createRoot } from "react-dom/client";

const dom_root = document.getElementById("root");
if (!dom_root) {
  throw new Error("No root found");
}
const root = createRoot(dom_root);

root.render(<App />);

const loaded = parseInt(localStorage.getItem("customAngle") ?? "nan");
(window as any).customAngle = isNaN(loaded) ? null : loaded;
// (window as any).customAngle = -45;

let targetAngle = 0;
let currentAngle = 0;

let oldT = 0;
const frame = (t: number) => {
  t /= 1000;
  const customAngle = (window as any).customAngle;
  if (customAngle !== null)
    localStorage.setItem("customAngle", customAngle.toString());
  targetAngle = customAngle ?? Math.sin(t) * 45;

  const dt = t - oldT;
  const prop = Math.min(Math.max(dt * 10, 0), 1);
  currentAngle = (1 - prop) * currentAngle + prop * targetAngle;

  // Round to 3 digits after the . because the currentAngle may continue
  // to change infinidismally and that's annoying
  const usedAngle = Math.round(currentAngle * 1_000) / 1_000;
  document.documentElement.style.setProperty('--angle', `${usedAngle}deg`);

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
