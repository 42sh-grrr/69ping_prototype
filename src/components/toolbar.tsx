import * as React from "react";
import * as classes from "./toolbar.module.scss";

export function ToolBar() {
  return <div className={classes["tool-bar"]}>
    <ul>
      <li><span>F</span><span>i</span><span>c</span><span>h</span><span>i</span><span>e</span><span>r</span></li>
      <li><span>B</span><span>r</span><span>e</span><span>f</span></li>
      <li><span>J</span><span>s</span><span>p</span></li>
      <li><span>L</span><span>e</span><span>s</span></li>
      <li><span>T</span><span>r</span><span>u</span><span>c</span><span>s</span></li>
    </ul>
  </div>;
}
