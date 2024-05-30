import * as React from "react";
import * as classes from "./filepicker.module.scss";

export function FilePicker() {
  return (
    <div className={classes["file-picker"]}>
      <ul className="rotated-container">
        {new Array(5).fill(null).map((_, i) => <li key={i} className="rotated-element">
          File number {i}
        </li>)}
      </ul>
    </div>
  );
}
