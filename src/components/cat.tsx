import { useCallback, useEffect, useRef, useState } from "react";
import * as classes from "./cat.module.scss";

const LINKS = [
  "https://hfax.fr/f/bYjq.wav",
  "https://hfax.fr/f/jhGc.wav",
  "https://hfax.fr/f/YVZK.wav",
  "https://hfax.fr/f/ZTfx.wav",
  "https://hfax.fr/f/UBRV.wav",
  "https://hfax.fr/f/gHJF.wav",
]

export function Cat() {
  const [cat, setCat] = useState(null as string | null);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const frontRef = useRef<HTMLDivElement | null>(null);

  const fetchNewImage = useCallback(async (force: boolean = false) => {
    if (!force && cat === null)
      return;
    setCat(null);
    const response = await fetch("https://api.thecatapi.com/v1/images/search")
    if (!response.ok) {
      alert("error fetching cat");
      return;
    }
    const body = (await response.json())[0];
    console.log(body);

    const img = document.createElement("link");
    console.log(img);

    img.onload = () => {
      setCat(body.url);
      img.remove();
    };

    img.rel = "prefetch";
    img.href = body.url;
    document.head.appendChild(img);
  }, [cat]);

  const playSound = useCallback(() => {
    try {
      const audio = new Audio(LINKS[Math.floor(Math.random() * LINKS.length)]);
      audio.play();
    }
    catch {
      console.log("Could not play sound");
    }
  }, []);

  let fetched = false;
  useEffect(() => {
    if (cat === null && fetched === false)
      fetchNewImage(true);
    fetched = true;
  }, []);

  let in_;
  if (cat === null) {
    in_ = <div className={classes.loading}>Loading...</div>;
  }
  else {
    in_ = <>
      <img className={classes.back} src={cat ?? ""} onLoad={() => {
        const image = new Image();
        image.src = cat;
        setWidth(image.width);
        setHeight(image.height);

        playSound();
      }} />
      <div className={classes.front} ref={frontRef} style={{
        backgroundImage: `url(${cat ?? ""})`
      }} />
    </>;
  }

  const catRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const catEl = catRef.current;
    if (!catEl)
      return;

    const updateSizes = () => {
      catEl.style.setProperty("--cat-width", `${catEl.clientWidth}px`);
      catEl.style.setProperty("--cat-height", `${catEl.clientHeight}px`);
    };
    const resize_observer = new ResizeObserver(updateSizes);
    updateSizes();
    resize_observer.observe(catEl);

    return () => resize_observer.disconnect();
  }, []);

  return <div className={classes.container} ref={catRef} onClick={() => fetchNewImage()} style={{
    "--img-width": `${width}px`,
    "--img-height": `${height}px`,
    "--beta": `${height / width}`
  }}>
    {in_}
  </div>;
}

