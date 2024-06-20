import * as React from "react";
import { createPortal } from "react-dom";
import * as classes from "./settings.module.scss";
import { atom, useAtom } from "jotai";
import { useDevMode } from "../app";

const isOpen = atom(false);

export function useIsOpen(): [boolean, (val: boolean) => void] {
  return useAtom(isOpen);
}

function orNull(v: any): number | null {
  if (typeof v === "number" && !isNaN(v))
    return v;
  if (typeof v === "string")
    return orNull(Number(v));
  return null;
}

function SettingsInner() {
  const [_open, setOpen] = useIsOpen();
  const [devmode, setDevMode] = useDevMode();
  const [angle, setAngle] = React.useState<number | null>((window as any).customAngle ?? null);

  const setAngle2 = React.useCallback((v: any) => {
    (window as any).customAngle = orNull(v);
    setAngle(orNull(v));
  }, []);

  const changeAngle = React.useCallback((el: React.ChangeEvent<HTMLInputElement>) => {
    setAngle2(el.target.value);
  }, []);

  const makeRotate = React.useCallback((el: React.ChangeEvent<HTMLInputElement>) => {
    if (el.target.checked)
      setAngle2(null);
    else
      setAngle2(0);
  }, []);

  return <div className={classes.container}>
    <div className={classes.thing}>
      <div style={{marginBottom: "10px"}}>
        <label style={{marginRight: "10px"}}>
          <span style={{marginRight: "10px"}}>Angle</span>
          <input type="number" onChange={changeAngle} value={angle ?? ""} />
        </label>
        <label>
          Rotate
          <input type="checkbox" onChange={makeRotate} checked={angle == null} />
        </label>
      </div>
      <div>
        <label>
          Enable dev mode:
          <input type="checkbox" checked={devmode} onChange={e => setDevMode(e.target.checked)} />
        </label>
      </div>
      <div className={classes["close-section"]}>
        <button className={classes["button"]} type="button" onClick={() => setOpen(false)}>
          Close
        </button>
      </div>
    </div>
  </div>;
}

export function Settings() {
  const [open, setOpen] = useIsOpen();

  if (open)
    return createPortal(<SettingsInner/>, document.body);
  else
    return <></>;
}
