import * as React from "react";
import * as classes from "./code_editor.module.scss";

export type Props = React.PropsWithChildren & {
  code: string,
};

export function CodeEditor(props: Props) {
  return <div className={classes["code-editor"]}>
    <div className={classes["the-code"]}>
      {props.code.split("\n")
        .map((line, i) => <pre key={i} className={classes["line"]}>{line}</pre>)}
    </div>
  </div>;
}

