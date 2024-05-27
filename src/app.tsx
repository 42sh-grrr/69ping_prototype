import * as React from "react";
import * as classes from "./app.module.scss";

import { FilePicker } from "./components/filepicker";

export function App() {
  return <div className={classes.app}>
    <FilePicker />
  </div>;
}
