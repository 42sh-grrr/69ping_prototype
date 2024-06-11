import * as React from "react";
import * as classes from "./cat.module.scss";

const LINKS = [
  "https://hfax.fr/f/bYjq.wav",
  "https://hfax.fr/f/jhGc.wav",
  "https://hfax.fr/f/YVZK.wav",
  "https://hfax.fr/f/ZTfx.wav",
  "https://hfax.fr/f/UBRV.wav",
  "https://hfax.fr/f/gHJF.wav",
  "https://hfax.fr/f/frzX.wav",
]

export function Cat() {
  const [cat, setCat] = React.useState(null as string | null);

  const fetchNewImage = React.useCallback(async (force: boolean = false) => {
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

  const playSound = React.useCallback(() => {
    try {
      const audio = new Audio(LINKS[Math.floor(Math.random() * LINKS.length)]);
      audio.play();
    }
    catch
    {
      console.log("Could not play sound");
    }
  }, []);

  let fetched = false;
  React.useEffect(() => {
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
      <img className={classes.back} src={cat ?? ""} onClick={() => fetchNewImage()} onLoad={playSound} />
      <img className={classes.front} src={cat ?? ""} onClick={() => fetchNewImage()} onLoad={playSound} />
    </>;
  }

  return <div className={classes.container}>
    {in_}
  </div>;
}

