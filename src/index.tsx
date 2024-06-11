import { App } from "./app";
import * as React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "jotai";

const dom_root = document.getElementById("root");
if (!dom_root) {
  throw new Error("No root found");
}
const root = createRoot(dom_root);

root.render(<Provider><App /></Provider>);

const DEFAULT_ANGLE = 45;

const loaded = parseInt(localStorage.getItem("customAngle") ?? "nan");
(window as any).customAngle = isNaN(loaded) ? DEFAULT_ANGLE : loaded;
// (window as any).customAngle = -45;

let targetAngle = loaded;
let currentAngle = loaded;

let oldT = 0;
const frame = (t: number) => {
  t /= 1000;
  const customAngle = (window as any).customAngle;
  if (customAngle !== null)
    localStorage.setItem("customAngle", customAngle.toString());
  targetAngle = customAngle ?? Math.sin(t) * 45;

  const dt = t - oldT;
  const half_life = 0.1;
  currentAngle = targetAngle + (currentAngle-targetAngle) * (2 ** (-dt / half_life));

  // Round to 3 digits after the . because the currentAngle may continue
  // to change infinidismally and that's annoying
  const usedAngle = Math.round(currentAngle * 1_000) / 1_000;

  const newProp = `${usedAngle}deg`;
  if (document.documentElement.style.getPropertyValue("--angle") !== newProp)
    document.documentElement.style.setProperty('--angle', newProp);

  if (currentAngle > 0) {
    if (document.body.classList.contains("angle-inverted"))
      document.body.classList.remove("angle-inverted");
  }
  else {
    if (!document.body.classList.contains("angle-inverted"))
      document.body.classList.add("angle-inverted");
  }
  
  oldT = t;
  requestAnimationFrame(frame);
};
requestAnimationFrame(frame);
