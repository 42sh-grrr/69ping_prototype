import { useEffect, useRef, useState } from "react";
import * as classes from "./code_editor.module.scss";
import { atom, useAtom } from "jotai";

export type OpenedFile = Readonly<{
  filePath: string,
  fileContent: string,
  dirty: boolean,
}>;
export const openedFileAtom = atom<OpenedFile | null>(null);

export function useOpenedFile() {
  return useAtom(openedFileAtom);
}

function escapeHtml(html: string): string {
  var text = document.createTextNode(html);
  var p = document.createElement('p');
  p.appendChild(text);
  return p.innerHTML;
}

export function CodeEditor() {
  const [ogCode, setOgCode] = useState<string | null>(null);
  const [code, setCode] = useState<string | null>(null);
  const codeRef = useRef<HTMLDivElement | null>(null);
  const visualCodeRef = useRef<HTMLDivElement | null>(null);
  const [openedFile, setOpenedFile] = useOpenedFile();

  useEffect(() => {
    if (!openedFile) {
      setOgCode(null);
      return;
    }

    console.log(openedFile);

    const content = openedFile.fileContent;
    const abort = new AbortController();
    fetch(content, {
      signal: abort.signal,
    }).then(r => {
      return r.text();
    }).then(content => {
      setOgCode(content);
    }).catch(console.error);
    return () => abort.abort();
  }, [openedFile?.filePath]);

  useEffect(() => {
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
      setCode(newCode);
      if (openedFile && !openedFile.dirty) {
        setOpenedFile({
          ...openedFile,
          dirty: true,
        });
      }
    };
    el.addEventListener("input", input);

    return () => {
      el.removeEventListener("input", input);
    };
  }, [openedFile]);

  useEffect(() => {
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
        newEl.classList.add(classes["line"], `line-${i}`);
        newEl.setAttribute("data-line-number", i.toString());
        el.appendChild(newEl);
      }
      else
        newEl = lineEl;

      const new_html = escapeHtml(lineText)
        .replaceAll(/(--.*)$/g, "<span style='color: gray;'>$1</span>")
        .replaceAll(/([0-9]+(?:\.[0-9]+)?)/g, "<span style='color: cyan;'>$1</span>")
        .replaceAll(/( |\t|^)(\=|\$)( |\t|$)/g, "$1<span style='color: red;'>$2</span>$3")
        .replaceAll(/( |\t|^)(import|module|let|where|as|do)( |\t|$)/g, "$1<span style='color: yellow;'>$2</span>$3")
        .replaceAll(/( |\t|^)(\(|\)|\{|\})( |\t|$)/g, "$1<span style='color: #ADDFFF;'>$2</span>$3")
        .replaceAll(/("(?:\\.|[^"\\])*")/g, "<span style='color: lime;'>$1</span>")
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
  }, [code]);

  useEffect(() => {
    const el = codeRef.current;
    if (el === null)
      return;
    console.log("reset the code");

    if (ogCode === null)
      return;

    setCode(ogCode);
    el.innerHTML = ogCode.split("\n")
      .map(code => `<pre class='${classes["line"]}'>${escapeHtml(code)}</pre>`)
      .join("");
  }, [ogCode]);

  return <div className={classes["code-editor"]}>
    <div className={classes["code-container"]}>
      <div
        ref={visualCodeRef}
        className={`${classes["the-visual-code"]}`}
      />
      <div
        ref={codeRef}
        className={`${classes["the-code"]}`}
        contentEditable={true}
        spellCheck={false}
      />
    </div>
  </div>;
  // {props.code.split("\n")
  //   .map((line, i) => <pre key={i} className={classes["line"] + " rotated-element"}>{line}</pre>)}
}

