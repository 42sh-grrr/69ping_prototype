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

const storedCustomAngle = localStorage.getItem("customAngle") ?? null;
const loaded = storedCustomAngle === null ? DEFAULT_ANGLE : parseInt(storedCustomAngle);
(window as any).customAngle = loaded;

let targetAngle = loaded ?? 0;
let currentAngle = loaded ?? 0;

let oldT = 0;
const frame = (t: number) => {
  t /= 1000;
  const customAngle = (window as any).customAngle;
  if (customAngle !== null)
    localStorage.setItem("customAngle", customAngle.toString());
  else
    localStorage.removeItem("customAngle");
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
