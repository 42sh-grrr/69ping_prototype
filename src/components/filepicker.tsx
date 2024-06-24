import { createRef, useCallback, useEffect, useMemo, useRef } from "react";
import * as classes from "./filepicker.module.scss";
import FolderIcon from '@mui/icons-material/Folder';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import { useOpenedFile } from "./code_editor";

type FolderNode = {
  type: "folder",
  name: string,
  children: Node[],
};

type FileNode = {
  type: "file",
  name: string,
  content?: string,
};

type Node = FolderNode | FileNode;

function FolderEntry({ path, folder }: { path: string, folder: FolderNode }) {
  return <li>
    <details>
      <summary className={classes["node"]}>
        <FolderIcon className={classes["folder-close-icon"]}/>
        <FolderOpenIcon className={classes["folder-open-icon"]}/>
        {folder.name}
      </summary>
      <ul>
        {folder.children.map(child => {
          const childpath = `${path}/${child.name}`;
          return <NodeEntry key={childpath} node={child} path={childpath} />;
        })}
      </ul>
    </details>
  </li>;
}

function FileEntry({ path, file }: { path: string, file: FileNode }) {
  const [openedFile, setOpenedFile] = useOpenedFile();

  const click = useCallback(() => {
    if (!file.content)
      return;
    setOpenedFile({
      fileContent: file.content,
      filePath: path,
      dirty: false,
    });
  }, []);

  if (openedFile?.filePath == path) {
    return <li className={`${classes["node"]} ${classes["opened-node"]}`}>
      {file.name} {openedFile.dirty && <span>*</span>}
    </li>;
  }
  else {
    return <li className={`${classes["node"]}`} onClick={click}>
      {file.name}
    </li>;
  }
}

function NodeEntry(props: {
  path: string,
  node: Node,
}) {
  const node = props.node;
  if (node.type === "folder") {
    return <FolderEntry path={props.path} folder={node} />;
  }
  else if (node.type === "file") {
    return <FileEntry path={props.path} file={node} />;
  }
}

export function FilePicker() {
  const rootNodes: Node[] = useMemo(() => {
    return [
      {
        type: "folder",
        name: "69ping",
        children: [
          { type: "file", name: "index.js", content: "https://gist.githubusercontent.com/enjalot/4979406/raw/8eaaf4c425bc29eaaee15003187b9e341fadf2df/inlet.js" },
          { type: "file", name: "index.html", content: "https://gist.githubusercontent.com/caseyamcl/9260337/raw/05d91018af46dc738564f288e3b2c9c26884762e/sample.html" },
          {
            type: "folder", name: "node_modules",
            children: [
              { type: "file", name: "bcp" },
              { type: "file", name: "trop" },
              { type: "file", name: "de" },
              { type: "file", name: "dependencies" },
            ],
          },
          { type: "file", name: "Un" },
          { type: "file", name: "Fichier" },
        ],
      },
      {
        type: "folder",
        name: "69sh",
        children: [
          { type: "file", name: "build.sh" },
          { type: "file", name: "main.c" },
          {
            type: "folder", name: "build",
            children: [
              { type: "file", name: "bcp" },
              { type: "file", name: "trop" },
              { type: "file", name: "de" },
              { type: "file", name: "fichier" },
            ],
          },
          { type: "file", name: "autre.c" },
          { type: "file", name: "un_autre.c" },
        ],
      },
      {
        type: "folder",
        name: "69hs",
        children: [
          { type: "file", name: "hello_word.hs", content: "https://gist.githubusercontent.com/saml/1252517/raw/c5117b197f9da41b9b50f56d4bf02ffa78e406c3/HelloWorldHttp.hs" },
        ],
      }
    ];
  }, []);

  const filepickerRef = useRef<HTMLDivElement | null >(null);

  useEffect(() => {
    const filepickerEl = filepickerRef.current;
    if (!filepickerEl)
      return;

    const updateSizes = () => {
      filepickerEl.style.setProperty("--filepicker-width", `${filepickerEl.clientWidth}px`);
      filepickerEl.style.setProperty("--filepicker-height", `calc(${filepickerEl.clientHeight}px - var(--toolbar-height))`);
    };
    const resize_observer = new ResizeObserver(updateSizes);
    updateSizes();
    resize_observer.observe(filepickerEl);

    return () => resize_observer.disconnect();
  }, []);

  return (
    <div className={classes["file-picker"]} ref={filepickerRef}>
      <div className={classes["file-picker-inner"]}>
        {rootNodes.map((n, i) => (
          <ul>
            <NodeEntry node={n} key={i} path={"/"+n.name} />        
          </ul>
        ))}
      </div>  
    </div>
  );
}
