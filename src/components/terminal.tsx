import { PropsWithChildren, useEffect, useRef } from "react";
import * as classes from "./terminal.module.scss"

function Line(props: PropsWithChildren) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const t = ref.current;
    if (!t)
      return;

    let f = 0;
    const frame = () => {
      const bound = t.getBoundingClientRect();
      t.style.setProperty("--pos-x", `${bound.x}px`);
      t.style.setProperty("--pos-y", `${bound.y}px`);
      t.style.setProperty("--width", `${bound.width}px`);

      f = requestAnimationFrame(frame);
    };
    frame();

    return () => cancelAnimationFrame(f);
  }, [ref.current]);

  return <div ref={ref} className={classes["line"]}>
    {props.children}
  </div>;
}

export function Terminal() {
  return <div className={classes["terminal"]}>
    <Line># echo Bonjour</Line>
    <Line>Bonjour</Line>
    <Line># yes Bonjour</Line>
    {Array(50).fill(null).map((_, i) => (
      <Line key={i}>Bonjour</Line>
    ))}
  </div>;
}
