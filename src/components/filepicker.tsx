import * as classes from "./filepicker.module.scss";

export function FilePicker() {
  return (
    <div className={classes["file-picker"]}>
      <ul>
        {new Array(5).fill(null).map((_, i) => <li key={i}>
          File number {i}
        </li>)}
      </ul>
    </div>
  );
}
