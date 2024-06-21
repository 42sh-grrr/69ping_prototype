import { PropsWithChildren, useCallback } from "react";
import { createPortal } from "react-dom";
import * as classes from "./toolbar.module.scss";
import { useIsOpen } from "./settings";

function Wordise(props: { children: string }) {
  return <span>
    {props.children.split("").map((c, i) => <span key={i} className={classes.letter}>{c}</span>)}
  </span>;
}

function ToolBarElement(props: PropsWithChildren) {
  return <li className={classes["toolbar-el"]}>
    {props.children}
  </li>;
}

export function ToolBar() {
  const [isConfigOpen, setIsConfigOpen] = useIsOpen();

  const open = useCallback(() => {
    setIsConfigOpen(true);
  }, []);

  return <div className={classes["tool-bar"]}>
    <ul>
      <li onClick={open}>
        <Wordise>Configuration</Wordise>
      </li>
      <ToolBarElement>
        <summary><Wordise>Fichier</Wordise></summary>
        <ul>
          <li>Open</li>
          <li>Close</li>
          <li>Delete</li>
          <li>Nuke</li>
        </ul>
      </ToolBarElement>
      <ToolBarElement>
        <summary><Wordise>Edit</Wordise></summary>
        <ul>
          <li>Copy</li>
          <li>Paste</li>
          <li>Cheat</li>
          <li>lol</li>
        </ul>
      </ToolBarElement>
      <ToolBarElement>
        <summary><Wordise>Bref</Wordise></summary>
        <ul>
          <li>Copy</li>
          <li>Paste</li>
          <li>Cheat</li>
          <li>lol</li>
        </ul>
      </ToolBarElement>
      <ToolBarElement>
        <summary><Wordise>Autre chose</Wordise></summary>
        <ul>
          <li>Copy</li>
          <li>Paste</li>
          <li>Cheat</li>
          <li>lol</li>
        </ul>
      </ToolBarElement>
    </ul>
  </div>;
}
