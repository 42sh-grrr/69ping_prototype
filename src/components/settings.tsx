import * as React from "react";
import { createPortal } from "react-dom";
import * as classes from "./settings.module.scss";
import { atom, useAtom } from "jotai";

const isOpen = atom(false);

export function useIsOpen(): [boolean, (val: boolean) => void] {
  return useAtom(isOpen);
}

function SettingsInner() {
  const [_open, setOpen] = useIsOpen();
  const [angle, setAngle] = React.useState<number>(+(window as any).customAngle);

  const changeAngle = React.useCallback((el: React.ChangeEvent<HTMLInputElement>) => {
    (window as any).customAngle = +el.target.value;
    setAngle(+el.target.value);
  }, []);

  return <div className={classes.container}>
    <div className={classes.thing}>
      <div style={{marginBottom: "10px"}}>
        <label>
          Angle: 
          <input type="number" onChange={changeAngle} value={angle} />
        </label>
      </div>
      <div>
        <button type="button" onClick={() => setOpen(false)} style={{cursor: "pointer", padding: "5px", background: "gray"}}>
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
