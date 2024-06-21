import { useEffect, useRef, useState } from "react";
import * as classes from "./code_editor.module.scss";
import { atom, useAtom } from "jotai";
import { BundledTheme, getHighlighter, Highlighter, ThemeInput } from "shiki";

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

const THEME_NAME: BundledTheme = "dracula";

export function CodeEditor() {
  const [ogCode, setOgCode] = useState<string | null>(null);
  const [code, setCode] = useState<string | null>(null);
  const codeRef = useRef<HTMLDivElement | null>(null);
  const visualCodeRef = useRef<HTMLDivElement | null>(null);
  const [openedFile, setOpenedFile] = useOpenedFile();
  const [hlgter, setHlgter] = useState<null | Highlighter>();

  useEffect(() => {
    getHighlighter({
      langs: ["haskell", "javascript", "html", "css"],
      themes: [THEME_NAME]
    }).then(h => {
      setHlgter(h);
    });
  }, []);

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
    if (!hlgter)
      return;

    let lang = "text";
    if (openedFile?.fileContent.endsWith(".js"))
      lang = "javascript";
    if (openedFile?.fileContent.endsWith(".hs"))
      lang = "haskell";
    if (openedFile?.fileContent.endsWith(".html"))
      lang = "html";

    const html = hlgter.codeToHtml(code, {
      lang,
      theme: THEME_NAME,
    });

    el.innerHTML = html;
  }, [code, hlgter,openedFile]);

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

