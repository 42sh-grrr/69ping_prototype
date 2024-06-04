import * as React from "react";

const LINKS = [
  "https://hfax.fr/f/bYjq.wav",
  "https://hfax.fr/f/jhGc.wav",
  "https://hfax.fr/f/YVZK.wav",
  "https://hfax.fr/f/ZTfx.wav",
  "https://hfax.fr/f/UBRV.wav",
  "https://hfax.fr/f/gHJF.wav",
]

export function Cat() {
  const [cat, setCat] = React.useState(null as string | null);

  const fetchNewImage = React.useCallback(async () => {
    const response = await fetch("https://api.thecatapi.com/v1/images/search")
    if (!response.ok) {
      alert("error fetching cat");
      return;
    }
    const body = (await response.json())[0];
    console.log(body);
    setCat(body.url);
  }, []);

  const playSound = React.useCallback(() => {
    const audio = new Audio(LINKS[Math.floor(Math.random() * LINKS.length)]);
    audio.play();
  }, []);

  React.useEffect(() => {
    fetchNewImage();
  }, []);

  return <img src={cat ?? ""} onClick={fetchNewImage} onLoad={playSound} />;
}

