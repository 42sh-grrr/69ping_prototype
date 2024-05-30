import * as React from "react";
import * as classes from "./code_editor.module.scss";

export type Props = React.PropsWithChildren & {
  code: null | string,
  onInput?: (newCode: string) => void,
};

function escapeHtml(html: string): string {
  var text = document.createTextNode(html);
  var p = document.createElement('p');
  p.appendChild(text);
  return p.innerHTML;
}

export function CodeEditor(props: Props) {
  const [code, setCode] = React.useState(props.code);
  const codeRef = React.useRef<HTMLDivElement | null>(null);
  const visualCodeRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    setCode(props.code);
  }, [props.code]);

  React.useEffect(() => {
    const el = codeRef.current;
    if (!el)
      return;

    const input = () => {
      // Sometimes useless br are inserted and that breaks a lot things
      el.querySelectorAll("br").forEach(v => v.remove());

      const newCodeLines: string[] = [];
      el.childNodes.forEach(e => {
        if (e instanceof HTMLPreElement)
          newCodeLines.push(e.innerText);
      });
      const newCode = newCodeLines.join("\n");
      props.onInput?.(newCode);
      setCode(newCode);
    };
    el.addEventListener("input", input);

    return () => {
      el.removeEventListener("input", input);
    };
  }, [codeRef.current, props.onInput]);

  React.useEffect(() => {
    const el = visualCodeRef.current;
    if (el === null)
      return;

    if (code === null)
      return;

    const lines = code.split("\n");
    lines.forEach((lineText, i) => {
      const lineEl = el.querySelector(`&>.line-${i}`);
      let newEl: HTMLPreElement;

      if (lineEl === null || !(lineEl instanceof HTMLPreElement)) {
        newEl = document.createElement("pre") as HTMLPreElement;
        newEl.classList.add("rotated-element", classes["line"], `line-${i}`);
        newEl.setAttribute("data-line-number", i.toString());
        el.appendChild(newEl);
      }
      else
        newEl = lineEl;

      const new_html = escapeHtml(lineText)
        .replace(/(\=|\$)/g, "<span style='color: red;'>$1</span>")
        .replace(/(import|module|let|where|as|do)/g, "<span style='color: yellow;'>$1</span>")
        .replace(/(\(|\)|\{|\})/g, "<span style='color: #ADDFFF;'>$1</span>")
      ;
      if (new_html === newEl.innerHTML)
        return;
      newEl.innerHTML = new_html;
    });

    console.log("line count: ",lines.length);

    el.childNodes.forEach(child => {
      if (!(child instanceof HTMLPreElement))
        return;
      const ln = parseInt(child.getAttribute("data-line-number") ?? "nan");
      if (isNaN(ln) || ln >= lines.length)
        queueMicrotask(() => child.remove());
    });
  }, [visualCodeRef.current, code]);

  React.useEffect(() => {
    const el = codeRef.current;
    if (el === null)
      return;
    console.log("reset the code");

    if (props.code === null)
      return;

    el.innerHTML = props.code.split("\n")
      .map(code => `<pre class='rotated-element ${classes["line"]}'>${escapeHtml(code)}</pre>`)
      .join("");
  }, [props.code]);

  return <div className={classes["code-editor"]}>
    <div className={classes["code-container"]}>
      <div
        ref={visualCodeRef}
        className={`${classes["the-visual-code"]} rotated-container`}
      />
      <div
        ref={codeRef}
        className={`${classes["the-code"]} rotated-container`}
        contentEditable={true}
        spellCheck={false}
      />
    </div>
  </div>;
  // {props.code.split("\n")
  //   .map((line, i) => <pre key={i} className={classes["line"] + " rotated-element"}>{line}</pre>)}
}

