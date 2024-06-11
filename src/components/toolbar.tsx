import * as React from "react";
import { createPortal } from "react-dom";
import * as classes from "./toolbar.module.scss";
import { useIsOpen } from "./settings";

function Wordise(props: { children: string }) {
  return <span>
    {props.children.split("").map((c, i) => <span key={i} className={classes.letter}>{c}</span>)}
  </span>;
}

export function ToolBar() {
  const [isConfigOpen, setIsConfigOpen] = useIsOpen();

  const open = React.useCallback(() => {
    setIsConfigOpen(true);
  }, []);

  return <div className={classes["tool-bar"]}>
    <ul>
      <li onClick={open}>
        <Wordise>Configuration</Wordise>
      </li>
      <li>
        <Wordise>Fichier</Wordise>
      </li>
      <li>
        <Wordise>Et</Wordise>
      </li>
      <li>
        <Wordise>D'autre</Wordise>
      </li>
      <li>
        <Wordise>Trucs</Wordise>
      </li>
    </ul>
  </div>;
}
