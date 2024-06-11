import * as React from "react";
import * as classes from "./toolbar.module.scss";

function Wordise(props: { children: string }) {
  return <span>
    {props.children.split("").map((c, i) => <span key={i} className={classes.letter}>{c}</span>)}
  </span>;
}

export function ToolBar() {

  return <div className={classes["tool-bar"]}>
    <ul>
      <li>
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
