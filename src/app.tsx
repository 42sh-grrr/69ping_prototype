import * as React from "react";
import * as classes from "./app.module.scss";

import { FilePicker } from "./components/filepicker";
import { CodeEditor } from "./components/code_editor";
import { ToolBar } from "./components/toolbar";
import { Cat } from "./components/cat";
import { Settings } from "./components/settings";
import { atom, useAtom } from "jotai";
import { Terminal } from "./components/terminal";

const devMode = atom(localStorage.getItem("devmode") === "true");

export function useDevMode(): [boolean, (val: boolean) => void] {
  return useAtom(devMode);
}

export function App() {
  const appRef = React.useRef<HTMLDivElement|null>(null);
  const windowedRef = React.useRef<HTMLDivElement|null>(null);

  const [devMode, setDevMode] = useDevMode();
  const [code, setCode] = React.useState<string | null>(localStorage.getItem("code"));

  React.useEffect(() => {
    localStorage.setItem("devmode", ""+devMode);

    if (devMode)
      document.body.classList.add("devmode");
    else
      document.body.classList.remove("devmode");
  }, [devMode]);

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

  React.useEffect(() => {
    const appEl = appRef.current;
    const windowedEl = windowedRef.current;
    if (!appEl || !windowedEl)
      return;

    const updateSizes = () => {
      appEl.style.setProperty("--screen-width", `${windowedEl.clientWidth}px`);
      appEl.style.setProperty("--screen-height", `calc(${windowedEl.clientHeight}px - var(--toolbar-height))`);
    };
    const resize_observer = new ResizeObserver(updateSizes);
    updateSizes();
    resize_observer.observe(windowedEl);

    return () => resize_observer.disconnect();
  }, [appRef.current, windowedRef.current]);

  return <>
    <div className={classes.app} ref={appRef}>
      <FilePicker />
      <div className={classes.inner2}>
        <CodeEditor code={code} onInput={onInput} />
        <div className={classes.inner3}>
          <div className={classes.terminal}>
            <Terminal />
          </div>
          <div>
            <Cat />
          </div>
        </div>
      </div>
    </div>
    <div className={classes.windowed} ref={windowedRef}>
      <ToolBar />
    </div>
    <Settings/>
  </>;
}
