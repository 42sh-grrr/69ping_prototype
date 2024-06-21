import { PropsWithChildren, useCallback } from "react";
import { createPortal } from "react-dom";
import * as classes from "./toolbar.module.scss";
import { useIsOpen } from "./settings";

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
        Configuration
      </li>
      <ToolBarElement>
        <summary>Fichier</summary>
        <ul>
          <li>Open</li>
          <li>Close</li>
          <li>Delete</li>
          <li>Nuke</li>
        </ul>
      </ToolBarElement>
      <ToolBarElement>
        <summary>Edit</summary>
        <ul>
          <li>Copy</li>
          <li>Paste</li>
          <li>Cheat</li>
          <li>lol</li>
        </ul>
      </ToolBarElement>
      <ToolBarElement>
        <summary>Bref</summary>
        <ul>
          <li>Copy</li>
          <li>Paste</li>
          <li>Cheat</li>
          <li>lol</li>
        </ul>
      </ToolBarElement>
      <ToolBarElement>
        <summary>Autre chose</summary>
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
