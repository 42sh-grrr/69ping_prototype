import * as React from "react";
import * as classes from "./app.module.scss";

import { FilePicker } from "./components/filepicker";
import { CodeEditor } from "./components/code_editor";
import { ToolBar } from "./components/toolbar";
import { Cat } from "./components/cat";
import { Settings } from "./components/settings";

export function App() {
  const [code, setCode] = React.useState<string | null>(localStorage.getItem("code"));

  React.useEffect(() => {
    if (code === null) {
      const controller = new AbortController();
      fetch(`https://gist.githubusercontent.com/saml/1252517/raw/c5117b197f9da41b9b50f56d4bf02ffa78e406c3/HelloWorldHttp.hs`, {
        signal: controller.signal,
      }).then(resp => resp.text()).then(code => {
        localStorage.setItem("code", code);
        setCode(code);
      });

      return () => {
        controller.abort();
      };
    }
  }, [code]);

  const onInput = React.useCallback((newCode: string) => {
    localStorage.setItem("code", newCode);
  }, []);

  return <>
    <div className={classes.app}>
      <ToolBar />
      <div className={classes.inner}>
        <FilePicker />
        <div className={classes.inner2}>
          <CodeEditor code={code} onInput={onInput} />
          <div className={classes.inner3}>
            <div className={classes.terminal}></div>
            <div>
              <Cat />
            </div>
          </div>
        </div>
      </div>
    </div>
    <Settings/>
  </>;
}
