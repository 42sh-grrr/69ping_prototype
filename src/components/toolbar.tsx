import * as React from "react";
import * as classes from "./toolbar.module.scss";

export function ToolBar() {
  return <div className={classes["tool-bar"]}>
    <ul>
      <li>Fichier</li>
      <li>Bref</li>
      <li>Jsp</li>
      <li>Les</li>
      <li>Trucs</li>
    </ul>
  </div>;
}
