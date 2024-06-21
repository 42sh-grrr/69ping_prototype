import * as React from "react";
import * as classes from "./chatbot.module.scss";
import chatbot from "../assets/chatbot.png";

export function ChatBot() {
  const [active, setActive] = React.useState(false);

  return (
    <>
      <div className={classes.icon} onClick={() => setActive(true)}>
        <img src={chatbot} />
      </div>
      {active && (
        <div className={classes.chat}>
          Hello, world
        </div>
      )}
    </>
  );
}
