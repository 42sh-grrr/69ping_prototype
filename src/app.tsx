import * as React from "react";
import * as classes from "./app.module.scss";

import { FilePicker } from "./components/filepicker";
import { CodeEditor } from "./components/code_editor";

export function App() {
  const [code, setCode] = React.useState("");

  React.useEffect(() => {
    const controller = new AbortController();
    fetch(`https://raw.githubusercontent.com/koalaman/shellcheck/master/shellcheck.hs`, {
      signal: controller.signal,
    }).then(resp => resp.text()).then(code => {
      setCode(code);
    });

    return () => {
      controller.abort();
    };
  }, []);

  return <div className={classes.app}>
    <FilePicker />
    <CodeEditor code={code} />
  </div>;
}
