import * as React from "react";

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
    const audio = new Audio('https://hfax.fr/f/jhGc.wav');
    audio.play();
  }, []);

  React.useEffect(() => {
    fetchNewImage();
  }, []);

  return <img src={cat ?? ""} onClick={fetchNewImage} onLoad={playSound} />;
}

